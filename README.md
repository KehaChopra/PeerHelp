# PeerHelp

PeerHelp is a full-stack real-time peer tutoring platform. This repository currently contains the initial client and server foundation only.

## Tech stack

- Frontend: React, TypeScript, and Vite
- Backend: Node.js, Express, and TypeScript
- Planned: PostgreSQL with Prisma, and Socket.IO for real-time features

## Run the client

```bash
cd client
npm install
npm run dev
```

Vite prints the local client URL when it starts (typically `http://localhost:5173`).

## Run the server

```bash
cd server
npm install
Copy-Item .env.example .env # PowerShell; optional because port 5000 is the default
npm run dev
```

The API runs at `http://localhost:5000` by default. Check it at `http://localhost:5000/api/health`.

For a production-style run:

```bash
cd server
npm run build
npm start
```

