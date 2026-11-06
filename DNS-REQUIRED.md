# DNS required for starlink.johnnybodegas.com

GoDaddy DNS access is currently unavailable via connector (availability/suggest only).

## Existing record check
Public DNS for `starlink.johnnybodegas.com` is NXDOMAIN. Safe to create; nothing to overwrite.

## Exact record to add (only this)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | starlink | bodegasjohnny-sketch.github.io | 600 (or GoDaddy default) |

Do **not** change apex A records, MX, TXT, wildcards, or nameservers.

## After DNS propagates
1. Rename `CNAME.pending` → `CNAME` in this repo and push (or create file `CNAME` with `starlink.johnnybodegas.com`).
2. In GitHub Pages settings, custom domain becomes `starlink.johnnybodegas.com`.
3. Wait for HTTPS certificate approval, then enforce HTTPS.

## Interim hosted preview (HTTPS verified)
https://bodegasjohnny-sketch.github.io/buklod-starlink/
