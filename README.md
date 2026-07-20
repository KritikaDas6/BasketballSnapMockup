# NBA × Snap Hub

A Snapchat-style **NBA Hub** mockup built with **Expo + React Native**. It runs in Expo Go on iPhone and as a mobile website you can share.

## Live demo (open on iPhone)

**https://kritikadas6.github.io/BasketballSnapMockup/**

Open that link in Safari on an iPhone. Add to Home Screen if you want it to feel more like an app.

> Note: the public web build does **not** include your OpenAI API key (GitHub blocks that). Ja Morant chat will use safe fallback replies online. Chat with live GPT still works locally when `nba-Snap/.env` has `EXPO_PUBLIC_OPENAI_API_KEY`.

## What's included

- **Flight Reacts hero** — “Flight on the Spot / Earn points with Flight”
- **Player stories** — tap Bitmoji-style avatars for a short video story
- **Ja Morant group chat** — GPT replies locally (3 free messages, then Snap+)
- **Snap Rewards** — redeem merch/tickets, deduct points, email a receipt
- **Holographic card showcase** — swipeable trading cards + friends tracker / trade modal
- Snap-style tabs + NBA × Snap header branding

## Project layout

```
BasketballSnapMockup/
└── nba-Snap/          ← Expo app (run commands from here)
    ├── src/app/       ← screens (Expo Router)
    ├── src/components/nba/
    ├── assets/images/
    └── .env.example
```

## Quick start (local)

```bash
cd nba-Snap
npm install
cp .env.example .env   # then fill in your keys
npx expo start
```

- Press `w` for web
- Scan the QR with **Expo Go** on iPhone
- Press `i` for iOS Simulator

### Environment variables (`nba-Snap/.env`)

```bash
EXPO_PUBLIC_OPENAI_API_KEY=sk-...
EXPO_PUBLIC_RECEIPT_EMAIL=you@email.com
```

| Variable | Purpose |
|----------|---------|
| `EXPO_PUBLIC_OPENAI_API_KEY` | Ja Morant chat (local / private builds only) |
| `EXPO_PUBLIC_RECEIPT_EMAIL` | Optional default for Snap Rewards receipts |

Never commit `.env`.

## Deploy / update the shareable website

From `nba-Snap` (exports **without** secrets — keep `.env` out of the export):

```bash
# temporarily hide secrets so they aren't baked into the site
mv .env .env.bak
npx expo export -p web -c
mv .env.bak .env

npm run deploy   # pushes dist/ to the gh-pages branch
```

GitHub Pages serves: https://kritikadas6.github.io/BasketballSnapMockup/

## Scripts

| Command | Description |
|---------|-------------|
| `npx expo start` | Dev server |
| `npx expo start --web` | Web only |
| `npm run export:web` | Production static build → `dist/` |
| `npm run deploy` | Build + publish to GitHub Pages |
| `npx expo lint` | Lint |

## Repo

https://github.com/KritikaDas6/BasketballSnapMockup
