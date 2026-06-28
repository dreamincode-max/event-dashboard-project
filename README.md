# SLV Events — Event Planning Dashboard

A full-stack MERN event planning dashboard with authentication, event/guest management, budget analytics, and AI assistant tools.

## Stack

- **Frontend:** React 19, Vite, Tailwind CSS 4, Recharts
- **Backend:** Express, MongoDB/Mongoose, JWT
- **AI:** OpenAI / Gemini with demo fallback

## Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env   # add MONGO_URI, optional JWT_SECRET & AI keys
npm run dev
```

### Frontend

```bash
npm install
cp .env.example .env   # optional: VITE_API_URL=http://localhost:5000/api
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend dev server |
| `npm run build` | Production build |
| `cd backend && npm run dev` | Start API with nodemon |
