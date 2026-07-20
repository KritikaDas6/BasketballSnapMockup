# NBA × Snap Hub

A Snapchat-style **NBA Hub** mockup built with **Expo + React Native**. It runs in Expo Go on iPhone and as a mobile website you can share.

## Live demo (open on iPhone)

### Share this link

**https://nba-x-snap-hub.vercel.app/**

Open it in **Safari on iPhone**. You can also tap Share → Add to Home Screen for an app-like icon.

> The public site does **not** embed your OpenAI API key (that would be unsafe). Ja Morant chat uses short fallback replies online. Live GPT chat still works on your machine when `nba-Snap/.env` has `EXPO_PUBLIC_OPENAI_API_KEY`.

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
| `EXPO_PUBLIC_OPENAI_API_KEY` | Ja Morant chat (local only — never bake into public deploys) |
| `EXPO_PUBLIC_RECEIPT_EMAIL` | Optional default for Snap Rewards receipts |

Never commit `.env`.

## Update the live website

```bash
cd nba-Snap

# hide secrets so they are not baked into the public JS bundle
mv .env .env.bak
npx expo export -p web -c
mv .env.bak .env

npx vercel dist --prod --name nba-x-snap-hub --yes
```

## Scripts

| Command | Description |
|---------|-------------|
| `npx expo start` | Dev server |
| `npx expo start --web` | Web only |
| `npm run export:web` | Production static build → `dist/` |
| `npx expo lint` | Lint |

## Repo

https://github.com/KritikaDas6/BasketballSnapMockup
