# Fishing Score

Fishing Score is a full-stack web application for tracking fishing sessions, catches, fish species, and leaderboard scores.

Users can create fishing sessions, add catches to those sessions, optionally register weight and length, and compare scores on a public leaderboard. The scoring system rewards catches and measurements while taking session duration into account.

This project is currently an MVP, built as my first full web application while learning programming and preparing to move forward in my career.

## Live Demo

- App: https://fishingscore.vercel.app/en
- API: https://fishingscore-api.onrender.com

## Features

- User registration and login
- JWT authentication
- Protected user routes
- User-owned fishing sessions
- Create, update, finish, and delete sessions
- Create, update, and delete catches
- Fish species management for admins and moderators
- Public leaderboard
- Personal score summary
- Portuguese and English routes
- Responsive frontend built with Next.js

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- next-intl
- Vercel

### Backend

- Node.js
- Express
- TypeScript
- PostgreSQL
- JWT
- bcrypt
- Render

### Database

- PostgreSQL
- Render PostgreSQL

## Project Structure

```txt
FishingScore/
├── backend/      # Express API
├── frontend/     # Next.js app
├── database/     # SQL schema
└── README.md
```

## Scoring

Each fishing session receives a score based on:

- number of catches
- total catch weight
- total catch length
- session duration

The current formula gives base points for each catch, adds bonus points for weight and length, then reduces the final score based on session duration.

## Getting Started

### Prerequisites

- Node.js
- npm
- PostgreSQL

### 1. Clone the repository

```bash
git clone https://github.com/Rik-145/FishingScore.git
cd FishingScore
```

### 2. Create the database

Create a PostgreSQL database and run the schema:

```bash
psql "postgresql://USER:PASSWORD@HOST:5432/DATABASE" -f database/schema.sql
```

You can also run the SQL manually using a database client such as DBeaver.

### 3. Configure the backend

Create `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fishing_score_v2
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=change_this_secret
CORS_ORIGIN=http://localhost:3000
```

Install dependencies and start the backend:

```bash
cd backend
npm install
npm run dev
```

The API runs on:

```txt
http://localhost:3000
```

If you want to run the frontend on port `3000`, run the backend on another port and update the frontend API URL accordingly.

### 4. Configure the frontend

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Install dependencies and start the frontend:

```bash
cd frontend
npm install
npm run dev
```

The app runs on:

```txt
http://localhost:3000
```

## API Routes

Main backend route groups:

```txt
/api/auth
/api/users
/api/fish
/api/sessions
/api/catches
/api/scores
```

## Deployment

The MVP is deployed with:

- Frontend on Vercel
- Backend on Render
- PostgreSQL on Render

Production environment variables:

### Backend

```env
DB_HOST=...
DB_PORT=5432
DB_NAME=...
DB_USER=...
DB_PASSWORD=...
JWT_SECRET=...
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

## Roadmap

- Improve UX and UI
- Add user profile page
- Add password reset flow
- Add catch photos
- Improve leaderboard filters
- Add more statistics
- Improve mobile experience
- Add automated tests

## Status

This project is an MVP. The main flows are functional, but the app is still being improved.

## Author

Built by [Rik-145](https://github.com/Rik-145).
