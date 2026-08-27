import QRCode from 'qrcode';
 
// Same look/settings used across the QR feature — change once, applies everywhere.
const QR_RENDER_OPTIONS = {
  width: 512,
  margin: 2,
  color: { dark: '#1a1a1a', light: '#FFFFFF' },
};
 
/**
 * Builds a unique, human-readable QR value for a place.
 * e.g. "TOUR-PANDAV-LENI-CAVES-4821"
 */
export function buildQrValue(name) {
  const slug = name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const stamp = Date.now().toString().slice(-4);
  return `TOUR-${slug}-${stamp}`;
}
 
/**
 * Renders `value` as a PNG data URL (base64) — ready to use directly
 * in <img src={qrDataUrl} /> on the frontend.
 */
export async function generateQrDataUrl(value) {
  return QRCode.toDataURL(value, QR_RENDER_OPTIONS);
}
 
/**
 * Renders `value` as a raw PNG buffer — used to stream a
 * downloadable file from an Express route.
 */
export async function generateQrBuffer(value) {
  return QRCode.toBuffer(value, QR_RENDER_OPTIONS);
}
