import type { Request, Response } from 'express';
import crypto from 'crypto';

const ADMIN_LOGIN = process.env.ADMIN_LOGIN || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'BronzeVIP@2026';
const JWT_SECRET = process.env.ADMIN_SESSION_SECRET || 'mbronze_secure_salt_vip_studio_2026';

// In-Memory Rate Limiter for Serverless
const loginRateLimitMap = new Map<string, { attempts: number; blockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

function generateToken(username: string): string {
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  const payload = `${username}:${expiresAt}`;
  const hmac = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${hmac}`).toString('base64');
}

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

export default function handler(req: Request, res: Response) {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  const url = req.url || '';

  try {
    // POST /api/auth/login
    if (url.includes('/auth/login') && req.method === 'POST') {
      const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || 'unknown';
      const now = Date.now();
      const record = loginRateLimitMap.get(clientIp) || { attempts: 0, blockedUntil: 0 };

      if (record.blockedUntil > now) {
        const remainingMinutes = Math.ceil((record.blockedUntil - now) / 60000);
        return res.status(429).json({
          error: `Muitas tentativas incorretas. Conta bloqueada temporariamente. Tente novamente em ${remainingMinutes} minuto(s).`
        });
      }

      const { login, password } = req.body || {};
      if (!login || !password) {
        return res.status(400).json({ error: 'Credenciais inválidas.' });
      }

      const trimmedLogin = String(login).trim().toLowerCase();
      const trimmedAdmin = ADMIN_LOGIN.trim().toLowerCase();

      if (trimmedLogin === trimmedAdmin && password === ADMIN_PASSWORD) {
        loginRateLimitMap.delete(clientIp);
        const token = generateToken(trimmedLogin);
        return res.json({
          success: true,
          token,
          user: { login: ADMIN_LOGIN, role: 'admin' },
          expiresIn: '24h'
        });
      } else {
        record.attempts += 1;
        if (record.attempts >= MAX_ATTEMPTS) {
          record.blockedUntil = now + LOCKOUT_MS;
          loginRateLimitMap.set(clientIp, record);
          return res.status(429).json({
            error: 'Limite de 5 tentativas de login atingido. Acesso bloqueado por 15 minutos para proteger o sistema.'
          });
        }
        loginRateLimitMap.set(clientIp, record);
        const attemptsLeft = MAX_ATTEMPTS - record.attempts;
        return res.status(401).json({
          error: `Credenciais incorretas. Restam ${attemptsLeft} tentativa(s) antes do bloqueio temporário.`
        });
      }
    }

    // GET /api/auth/verify
    if (url.includes('/auth/verify') && req.method === 'GET') {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ valid: false });
      }
      const token = authHeader.substring(7);
      const result = verifyToken(token);
      return result.valid ? res.json({ valid: true, username: result.username }) : res.status(403).json({ valid: false });
    }

    // GET /api/admin/status
    if (url.includes('/admin/status') && req.method === 'GET') {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acesso negado.' });
      }
      const token = authHeader.substring(7);
      const result = verifyToken(token);
      if (!result.valid) {
        return res.status(403).json({ error: 'Sessão inválida.' });
      }
      return res.json({ status: 'online', secured: true, platform: 'vercel' });
    }

    return res.status(404).json({ error: 'Endpoint não encontrado.' });
  } catch {
    // Generic error - no details leaked
    return res.status(500).json({ error: 'Operação não permitida ou erro no processamento da solicitação.' });
  }
}
