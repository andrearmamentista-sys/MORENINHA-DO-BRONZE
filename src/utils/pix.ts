/**
 * Standard BR Code / Pix EMV Payload Generator
 * Compliant with Banco Central do Brasil Pix specifications.
 */

interface GeneratePixPayloadParams {
  pixKey: string;
  merchantName?: string;
  merchantCity?: string;
  amount?: number;
  txId?: string;
  description?: string;
}

// Remove accents and special characters for strict EMV compliance
function normalizeString(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()
    .toUpperCase();
}

function formatTLV(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

// CRC16-CCITT (polynomial 0x1021, init 0xFFFF)
function calculateCRC16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Normalizes Pix keys according to Banco Central do Brasil standards.
 * Phone keys MUST begin with +55 for banking apps to resolve the DICT registry properly.
 */
export function normalizePixKey(rawKey: string): string {
  if (!rawKey) return '+5521976333205';
  const trimmed = rawKey.trim();

  // If already starts with +55
  if (trimmed.startsWith('+55')) {
    const digits = trimmed.slice(3).replace(/\D/g, '');
    return `+55${digits}`;
  }

  // If email (contains @)
  if (trimmed.includes('@')) {
    return trimmed.toLowerCase();
  }

  // If UUID / EVP random key (36 chars with dashes)
  if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(trimmed)) {
    return trimmed.toLowerCase();
  }

  // Strip non-digits
  const digits = trimmed.replace(/\D/g, '');

  // 10 or 11 digits: Standard Brazilian phone number with DDD
  // (e.g. 21976333205 -> +5521976333205)
  if (digits.length === 10 || digits.length === 11) {
    return `+55${digits}`;
  }

  // 12 or 13 digits starting with 55 (e.g. 5521976333205)
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) {
    return `+${digits}`;
  }

  // 14 digits (CNPJ)
  if (digits.length === 14) {
    return digits;
  }

  return trimmed;
}

/**
 * Formats a Pix key for friendly user interface display
 */
export function formatPixKeyDisplay(key: string): string {
  const digits = key.replace(/\D/g, '');
  if (digits.length === 11 && (digits.startsWith('21') || digits.length === 11)) {
    // Format (21) 97633-3205
    const ddd = digits.slice(0, 2);
    const part1 = digits.slice(2, 7);
    const part2 = digits.slice(7);
    return `(${ddd}) ${part1}-${part2}`;
  }
  if (digits.length === 13 && digits.startsWith('55')) {
    const ddd = digits.slice(2, 4);
    const part1 = digits.slice(4, 9);
    const part2 = digits.slice(9);
    return `+55 (${ddd}) ${part1}-${part2}`;
  }
  return key;
}

export function generatePixPayload({
  pixKey,
  merchantName = 'MORENINHA DO BRONZE',
  merchantCity = 'RIO DE JANEIRO',
  amount = 0,
  txId = '***',
  description
}: GeneratePixPayloadParams): string {
  // Normalize fields according to Bacen Pix standard
  const cleanKey = normalizePixKey(pixKey || '21976333205');
  const cleanName = (normalizeString(merchantName) || 'MORENINHA DO BRONZE').slice(0, 25);
  const cleanCity = (normalizeString(merchantCity) || 'RIO DE JANEIRO').slice(0, 15);
  
  // TxID: In static Pix, if empty or invalid, Bacen mandates '***'
  let cleanTxId = (txId ? txId.replace(/[^a-zA-Z0-9]/g, '') : '').slice(0, 25);
  if (!cleanTxId) {
    cleanTxId = '***';
  }

  // Format 26 - Merchant Account Info (Pix)
  let mai26 = formatTLV('00', 'br.gov.bcb.pix') + formatTLV('01', cleanKey);
  if (description) {
    const cleanDesc = normalizeString(description).slice(0, 40);
    if (cleanDesc) {
      mai26 += formatTLV('02', cleanDesc);
    }
  }

  // Format 62 - Additional Data Field (TxID)
  const adf62 = formatTLV('05', cleanTxId);

  // Construct payload elements
  let payload =
    formatTLV('00', '01') + // Format indicator
    formatTLV('26', mai26) + // Merchant account info
    formatTLV('52', '0000') + // Merchant category code
    formatTLV('53', '986'); // Currency code (986 = BRL)

  // Tag 54 - Amount (Only included if amount > 0)
  if (amount && amount > 0) {
    const formattedAmount = amount.toFixed(2);
    payload += formatTLV('54', formattedAmount);
  }

  payload +=
    formatTLV('58', 'BR') + // Country code
    formatTLV('59', cleanName) + // Merchant name
    formatTLV('60', cleanCity) + // Merchant city
    formatTLV('62', adf62) + // Additional data (TxId)
    '6304'; // CRC16 placeholder

  const crc = calculateCRC16(payload);
  return `${payload}${crc}`;
}
