# PRD – PotionRH (eski adı Pembe Rüya Mario 1-1)

## Problem statement
Yüklenen mario-1-1.html oyunu pastel pembe temayla yeniden boyandı (sadece grafik). Sonra oyun "PotionRH" olarak özgünleştirildi:
bölüm ilk boruya kadar sınırlandı, canavar ve süre kaldırıldı, X kullanıcı adı girişi + MongoDB kaydı + X profil resmi, geri gidebilme, yeni karakter.

## Architecture
- Oyun: /app/frontend/public/game.html (tek dosya canvas). React App.js iframe ile `/game.html?api=<REACT_APP_BACKEND_URL>` yükler.
- Backend: FastAPI /api/players (POST upsert, GET /api/players/{nick}); Mongo `players` koleksiyonu (nick_key unique index).
- Avatar: https://unavatar.io/x/<nick> (anahtar gerekmez), canvas'a drawImage ile çizilir; yüklenmezse pembe kalp placeholder.
- localStorage: potionrh_nick, potionrh_avatar.

## Implemented
- 2026-06 (önceki tur): pastel pembe reskin, Stardew tarzı toprak, Türkçe ekranlar.
- 2026-06 (bu tur):
  - Seviye LEVEL_W=30 tile, tek boru (x=28, h=2) sağ sınır; sağ/sol görünmez duvar (at() sınır dışı GND).
  - Düşman yok, süre yok (HUD'da SURE kaldırıldı, zaman ölümü yok). Bayrak/kale/bonus oda kodu çağrılmıyor.
  - Kamera iki yöne takip eder (geri gidilebilir).
  - İlk girişte isim kapısı (data-testid name-gate / nick-input / nick-submit / nick-error), soru bloğu temalı BASLA butonu, Press Start 2P fontu.
  - HUD: POTIONRH + avatar + NICK; başlık kartı: POTIONRH / HOSGELDIN NICK / avatar.
  - Yeni karakter: kahverengi saç, yeşil tişört, turuncu pantolon, elinde mor iksir (mantar cork), boynunda Robinhood yeşili kolye. Küçük/büyük/ateş/yıldız paletleri güncellendi.
  - Geri dönen ziyaretçide arka planda POST ile visits/last_seen güncellenir.
- Test: /app/test_reports/iteration_2.json – backend 13/13, frontend tüm akışlar geçti.

## Backlog
- P1: Mobil dokunmatik kontroller
- P2: Skor tablosu (players koleksiyonuna skor ekleme), boruya ulaşınca ödül/animasyon
- P2: Yeni bölümler (kullanıcı şimdilik istemedi)

## Update (Jun 2026)
- Name gate is now 2 steps: X username -> EVM address (0x + 40 hex, validated client + server, stored as `evm_address`). Returning players without EVM are asked for it.
- Admin players table shows EVM address column.
- Welcome/loading/game-over card and page background switched from pink hearts to the potion image's cyan burst background.

## Update (Jun 2026) - Invite / Referral / Allow List
- Gate step 3/3: optional ref code (PRH + 5 digits). One-time, only at registration, own code rejected. Prefilled from `/?ref=CODE` links.
- Every player gets unique `ref_code` (PRHxxxxx, unique index). Each referral = +10 points to code owner (`invites` field, points = invites*10).
- After 4/4 quests a winged dino (user's image, /assets/dino.png) flies down and follows the player with an INVITE label; click/tap (or key I) opens invite modal: X, Instagram, Discord, WhatsApp + copy code. Instagram/Discord copy the message and open the app (no official share intent).
- Top-left ALLOW LIST button: latest 10 joined + top ref codes by points. Public endpoint GET /api/allowlist (no EVM exposed).
- Admin table shows ref code, invited by, points.
- Source zip served at /potionrh-source.zip (no .env files).
