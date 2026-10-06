/**
 * Standard BR Code / Pix EMV Payload Generator
 * Compliant with Banco Central do Brasil Pix specifications.
 */

interface GeneratePixPayloadParams {
  pixKey: string;
  merchantName: string;
  merchantCity: string;
  amount: number;
  txId?: string;
  description?: string;
}

// Remove accents and special characters for strict EMV compliance
function normalizeString(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim();
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

export function generatePixPayload({
  pixKey,
  merchantName,
  merchantCity,
  amount,
  txId = '***',
  description
}: GeneratePixPayloadParams): string {
  // Normalize fields
  const cleanKey = pixKey.trim();
  const cleanName = normalizeString(merchantName).slice(0, 25) || 'MARIANA GUEDES';
  const cleanCity = normalizeString(merchantCity).slice(0, 15) || 'RIO DE JANEIRO';
  const cleanTxId = (normalizeString(txId) || '***').slice(0, 25);
  const formattedAmount = amount > 0 ? amount.toFixed(2) : '0.00';

  // Format 26 - Merchant Account Info (Pix)
  let mai26 = formatTLV('00', 'br.gov.bcb.pix') + formatTLV('01', cleanKey);
  if (description) {
    const cleanDesc = normalizeString(description).slice(0, 40);
    mai26 += formatTLV('02', cleanDesc);
  }

  // Format 62 - Additional Data Field (TxID)
  const adf62 = formatTLV('05', cleanTxId);

  // Construct payload without CRC
  let payload =
    formatTLV('00', '01') + // Format indicator
    formatTLV('26', mai26) + // Merchant account info
    formatTLV('52', '0000') + // Merchant category code
    formatTLV('53', '986') + // Currency code (986 = BRL)
    formatTLV('54', formattedAmount) + // Transaction amount
    formatTLV('58', 'BR') + // Country code
    formatTLV('59', cleanName) + // Merchant name
    formatTLV('60', cleanCity) + // Merchant city
    formatTLV('62', adf62) + // Additional data (TxId)
    '6304'; // CRC16 placeholder

  const crc = calculateCRC16(payload);
  return `${payload}${crc}`;
}
