// Regenerates the content-integrity hash.
//
// Run this any time you INTENTIONALLY change one of the five protected
// strings (manifest name, app title, watermark credit line, or either
// social link) in the extension. Then update BOTH places with the new
// hash it prints:
//   1. EXPECTED_CONTENT_HASH in popup.js
//   2. contentIntegrity.hash in announcement.json (this repo)
//
// Usage:
//   node scripts/compute-hash.js
//
// Edit the five values below to match the new, correct on-screen text
// before running.

const crypto = require('crypto');

const manifestName   = '1dleryu X TikTok';
const titleText      = 'Idleryu X Tiktok';
const watermarkText  = 'Automatically appends the @ryu60fps credit line to your caption when you upload';
const tiktokHref     = 'https://www.tiktok.com/@ryu60fps';
const telegramHref   = 'https://t.me/loverielle76';

function norm(s) {
  return s.replace(/\s+/g, ' ').trim();
}

const canonical = [manifestName, titleText, watermarkText, tiktokHref, telegramHref]
  .map(norm)
  .join('||');

const hash = crypto.createHash('sha256').update(canonical, 'utf8').digest('hex');

console.log('Canonical string:', canonical);
console.log('New hash:        ', hash);
