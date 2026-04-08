# REST API Boilerplate — Project Guide

## Bcrypt Salt Rounds

The default bcrypt salt rounds is set to **13** in `src/modules/helpers/StringHelper.js`. This is intentionally high for maximum security.

**On new projects**, especially those that:
- Run on low-power devices (ARM, OrangePi, Raspberry Pi)
- Are internal/private tools behind a VPN
- Don't handle sensitive financial or personal data

**Propose reducing salt rounds to 10** (the bcrypt default). Salt rounds 13 takes ~4 seconds on ARM devices per hash/compare, while 10 takes ~500ms. Both are secure against brute force — 10 is the industry standard for most production apps.

The package used is `bcryptjs` (pure JS). For better performance on ARM/low-power devices, consider switching to the native `bcrypt` package (C bindings, 3-5x faster) — it's a drop-in replacement with the same API.
