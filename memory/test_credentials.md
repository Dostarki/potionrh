# Test credentials – PotionRH

## Admin panel (/admin)
- Password: value of env var `ADMIN_PASSWORD` (available in the shell env and backend process; never printed). Use: `echo $ADMIN_PASSWORD` in bash to pass it to curl/playwright.
- Login: POST /api/admin/login {"password": "..."} -> {"token"}; use `Authorization: Bearer <token>` for /api/admin/*.

## Players (no password)
- Any X username 2-12 chars [A-Za-z0-9_]; POST /api/players {"nick"}; e.g. `quest_tester`, `PotionTester`.
- Game stores nick in iframe localStorage key `potionrh_nick`, progress in `potionrh_progress`.
