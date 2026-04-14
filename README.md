# Kulkas Kejujuran

Web aplikasi Kulkas Kejujuran dengan fitur:
- Browse produk (Makanan & Minuman)
- Keranjang belanja
- Checkout dengan QRIS
- Admin dashboard (secret login)
- Dark/Light mode

## Tech Stack
- **Frontend**: React + Vite
- **Backend**: Express + SQLite
- **Deployment**: Docker + Docker Compose

## Development

### Prerequisites
- Node.js 18+
- npm

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## Docker Deployment

### Build and Run
```bash
docker-compose up -d
```

### Stop
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f
```

## Access
- **Frontend**: http://localhost
- **Backend API**: http://localhost:3001/api
- **Admin Login**: Click top-left corner, password: `admin123`

## Data Persistence
SQLite database is stored in `backend/data/` directory and persisted via Docker volume.

## Environment Variables

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:3001/api
```

### Backend (.env)
```
PORT=3001
```

## Production Deployment
1. Update `VITE_API_URL` in docker-compose.yml to your domain
2. Run `docker-compose up -d`
3. Database will be automatically initialized with seed data
