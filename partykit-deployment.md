# PartyKit Deployment — How It Works

## Context

The real-time collaboration feature uses Yjs for CRDT-based document sync and PartyKit as the WebSocket relay server. This document explains how the PartyKit server is deployed and how it connects to the client.

## What Was Deployed

**PartyKit server** (`partykit/server.ts`) — a lightweight WebSocket server that relays Yjs document updates between connected clients using `y-partykit`'s `onConnect()` handler.

## Where It Was Deployed

**Cloudflare's edge network**, via PartyKit's hosting platform.

- Command: `npx partykit deploy`
- Deployed URL: `https://slideforge-collab.dhruv-gupta01.partykit.dev`
- Config file: `partykit.json` (project name + entry point)

PartyKit runs on **Cloudflare Durable Objects** — each "room" gets its own persistent stateful instance on the edge. When you run `npx partykit deploy`, it:

1. Reads `partykit.json` to find the server entry point (`partykit/server.ts`)
2. Bundles and uploads the server code to Cloudflare
3. Provisions a subdomain: `{project-name}.{your-username}.partykit.dev`
4. The server is live globally on Cloudflare's edge network

## How the Client Connects

In `src/data/sync/syncAdapter.ts`:

```ts
const PARTYKIT_HOST =
  process.env.NEXT_PUBLIC_PARTYKIT_HOST ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "slideforge-collab.dhruv-gupta01.partykit.dev"  // production
    : "localhost:1999");                                // local dev
```

- **Local dev** (`bun dev` + `bun run dev:partykit`): connects to `ws://localhost:1999`
- **Production** (Vercel): connects to `wss://slideforge-collab.dhruv-gupta01.partykit.dev`

The `y-partykit` provider (`YPartyKitProvider`) auto-detects `ws://` vs `wss://` based on the host.

## Production Architecture

```
Browser Tab A (Vercel)  ←→  PartyKit Server (Cloudflare Edge)  ←→  Browser Tab B (Vercel)
     Next.js app                 WebSocket relay + persistence           Next.js app
     (static/client)             (Durable Object)                        (static/client)
```

- **Vercel** hosts the Next.js frontend (static, fully client-side)
- **Cloudflare** hosts the PartyKit WebSocket server (stateful, per-room)
- They are independent deployments — Vercel doesn't know about PartyKit and vice versa
- The browser is the glue: it loads the app from Vercel, then opens a WebSocket to PartyKit

## Key Commands

| Command | What it does |
|---------|-------------|
| `bun run dev:partykit` | Runs PartyKit locally on `localhost:1999` |
| `npx partykit deploy` | Deploys server to Cloudflare (production) |
| `npx partykit login` | Authenticate with PartyKit (first time only) |
| `npx partykit tail` | Stream production logs |

## Why It Works

1. **PartyKit handles WebSocket complexity** — connection management, reconnection, message routing
2. **y-partykit** adapter integrates Yjs sync protocol directly — the server just calls `onConnect()` and everything works
3. **Cloudflare Durable Objects** give each room persistent state — late joiners get the full document
4. **No database needed** — the Yjs document IS the persistence layer, stored in the Durable Object's storage
