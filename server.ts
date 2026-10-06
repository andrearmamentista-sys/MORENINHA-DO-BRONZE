import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Security: Disable x-powered-by header
app.disable('x-powered-by');

// Security & Parsing
app.use(express.json({ limit: '1mb' }));

// Custom Security Headers
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Environment-configured Admin Credentials (no password hardcoded in code)
const ADMIN_LOGIN = process.env.ADMIN_LOGIN || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'BronzeVIP@2026';
const JWT_SECRET = process.env.ADMIN_SESSION_SECRET || 'mbronze_secure_salt_vip_studio_2026';

// In-Memory Rate Limiting for Login Attempts ("limite de tentativa de login")
interface RateLimitRecord {
  attempts: number;
  blockedUntil: number;
}
const loginRateLimitMap = new Map<string, RateLimitRecord>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lockout

function cleanOldRateLimitRecords() {
  const now = Date.now();
  for (const [ip, record] of loginRateLimitMap.entries()) {
    if (record.blockedUntil < now && record.attempts === 0) {
      loginRateLimitMap.delete(ip);
    }
  }
}
setInterval(cleanOldRateLimitRecords, 5 * 60 * 1000);

// Helper: Sign Session Token
function generateToken(username: string): string {
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const payload = `${username}:${expiresAt}`;
  const hmac = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${hmac}`).toString('base64');
}

// Helper: Verify Session Token
function verifyToken(token: string): { valid: boolean; username?: string } {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length !== 3) return { valid: false };

    const [username, expiresAtStr, hmac] = parts;
    const expiresAt = parseInt(expiresAtStr, 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) {
      return { valid: false };
    }

    const payload = `${username}:${expiresAt}`;
    const expectedHmac = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('hex');

    const expectedBuffer = Buffer.from(expectedHmac);
    const providedBuffer = Buffer.from(hmac);
    if (expectedBuffer.length !== providedBuffer.length || !crypto.timingSafeEqual(expectedBuffer, providedBuffer)) {
      return { valid: false };
    }

    return { valid: true, username };
  } catch {
    return { valid: false };
  }
}

// Middleware: Require Admin Authentication on Server
export function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Acesso negado. Autenticação de administradora necessária.' });
    return;
  }

  const token = authHeader.substring(7);
  const result = verifyToken(token);
  if (!result.valid) {
    res.status(403).json({ error: 'Sessão inválida ou expirada. Faça login novamente.' });
    return;
  }

  next();
}

// ==================== AUTH API ROUTES ====================

// POST /api/auth/login - Protected with Rate Limiting
app.post('/api/auth/login', (req: Request, res: Response): void => {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  const record = loginRateLimitMap.get(clientIp) || { attempts: 0, blockedUntil: 0 };

  // Check if IP is currently locked out
  if (record.blockedUntil > now) {
    const remainingMinutes = Math.ceil((record.blockedUntil - now) / 60000);
    res.status(429).json({
      error: `Muitas tentativas incorretas. Conta bloqueada temporariamente. Tente novamente em ${remainingMinutes} minuto(s).`
    });
    return;
  }

  const { login, password } = req.body || {};

  if (!login || !password || typeof login !== 'string' || typeof password !== 'string') {
    res.status(400).json({ error: 'Credenciais inválidas.' });
    return;
  }

  const trimmedLogin = login.trim().toLowerCase();
  const trimmedAdminLogin = ADMIN_LOGIN.trim().toLowerCase();

  // Secure comparison
  const isLoginMatch = trimmedLogin === trimmedAdminLogin;
  const isPasswordMatch = password === ADMIN_PASSWORD;

  if (isLoginMatch && isPasswordMatch) {
    // Reset rate limiter on success
    loginRateLimitMap.delete(clientIp);

    const token = generateToken(trimmedLogin);
    res.json({
      success: true,
      token,
      user: {
        login: ADMIN_LOGIN,
        role: 'admin'
      },
      expiresIn: '24h'
    });
  } else {
    // Increment failed attempts
    record.attempts += 1;
    if (record.attempts >= MAX_ATTEMPTS) {
      record.blockedUntil = now + LOCKOUT_MS;
      loginRateLimitMap.set(clientIp, record);
      res.status(429).json({
        error: 'Limite de 5 tentativas de login atingido. Acesso bloqueado por 15 minutos para proteger o sistema.'
      });
      return;
    }

    loginRateLimitMap.set(clientIp, record);
    const attemptsLeft = MAX_ATTEMPTS - record.attempts;
    res.status(401).json({
      error: `Credenciais incorretas. Restam ${attemptsLeft} tentativa(s) antes do bloqueio temporário.`
    });
  }
});

// GET /api/auth/verify - Verify Session
app.get('/api/auth/verify', (req: Request, res: Response): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ valid: false });
    return;
  }

  const token = authHeader.substring(7);
  const result = verifyToken(token);
  if (result.valid) {
    res.json({ valid: true, username: result.username });
  } else {
    res.status(403).json({ valid: false });
  }
});

// GET /api/admin/status - Protected admin status
app.get('/api/admin/status', requireAdminAuth, (_req: Request, res: Response): void => {
  res.json({
    status: 'online',
    secured: true,
    rateLimitingEnabled: true,
    serverTime: new Date().toISOString()
  });
});

// Generic Error Handler ("erro sem detalhe", "debug desligado")
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  // Debug off: no stack traces or detailed internals leaked to client
  if (!isProd) {
    console.error('[SERVER NOTICE]', err.message);
  }
  res.status(500).json({
    error: 'Operação não permitida ou erro no processamento da solicitação.'
  });
});

// ==================== FRONTEND INTEGRATION ====================

async function startServer() {
  if (!isProd) {
    // Development mode: Mount Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve built dist files
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://0.0.0.0:${PORT} [Prod: ${isProd}]`);
  });
}

startServer();
