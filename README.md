# ryu-integrity-endpoint

The remote "backup" layer for the extension's content-integrity check.
It's a single static JSON file, deployed on Vercel, that holds the
**correct** content hash independently of the extension's own files.

## Why this matters

`popup.js` computes a hash of a few protected on-screen strings (the
app title, the watermark credit line, both social links, and the
manifest name) and compares it against `EXPECTED_CONTENT_HASH` baked
into that file. That catches tampering instantly and offline — but
it's still client-side: someone editing the HTML could, in theory,
also edit that constant to match their tampered copy.

This endpoint closes that gap. The extension also sends its
locally-computed hash and compares it against `contentIntegrity.hash`
here. That value lives only on the server, so an edited copy of the
extension still gets caught here as long as it's online.

## Already have an announcement.json deployed?

If `ANNOUNCEMENT_URL` in `popup.js` already points at a live repo
(right now: `1dleryu-annoncement-v2.vercel.app/announcement.json`),
you don't need a second deployment — just merge this block into your
existing JSON file and redeploy that repo:

```json
"contentIntegrity": {
  "enforce": true,
  "hash": "bebadddf499b21e23d2e4eae322632262b02017da3d1f2bfdf1bc289e6927e93"
}
```

## Deploying this repo standalone

1. Push this folder to a new GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new), import the repo, deploy
   with default settings (no build step needed — it's a static file).
3. Your endpoint will be live at `https://<project>.vercel.app/announcement.json`.
4. If you deploy this as a *new* URL instead of reusing the existing
   one, update `ANNOUNCEMENT_URL` in `popup.js` to match.

## Updating the hash when branding legitimately changes

If you intentionally change the title, watermark text, or a social
link:

1. Edit the five values at the top of `scripts/compute-hash.js` to
   match the new text exactly.
2. Run `node scripts/compute-hash.js`.
3. Copy the printed hash into **both**:
   - `EXPECTED_CONTENT_HASH` in `popup.js`
   - `contentIntegrity.hash` in `announcement.json`
4. Redeploy this repo and ship the new extension version together —
   if only one side updates, the other will (correctly) flag a
   mismatch.

## Turning enforcement off temporarily

Set `"enforce": false` in `announcement.json` to disable the remote
layer without touching the extension (e.g. while debugging a false
positive). The local check in `popup.js` still runs regardless.
