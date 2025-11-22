# Deployment Guide

## Prerequisites

- Docker Desktop installed
- Groq API key (free from https://console.groq.com)

## Quick Deployment

### 1. Clone Repository

```bash
git clone <repository-url>
cd cvify
```

### 2. Configure Environment

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

**Linux/Mac:**

```bash
cp .env.example .env
```

Edit `.env` and add your API key:

```env
GROQ_API_KEY=gsk_your_actual_key_here
PORT=3000
```

### 3. Start Services

```bash
docker compose up -d
```

First build takes ~2 minutes. Services will be available at:

- **Frontend**: http://localhost:5173 (or port 80 in prod)
- **Backend**: http://localhost:3000
- **Database**: localhost:5432

## Docker Architecture

### Services

1. **postgres** - PostgreSQL 15 database
   - Port: 5432
   - User: cvify
   - Password: cvify_password
   - Database: cvify_db

2. **backend** - NestJS application
   - Port: 3000
   - Depends on postgres
   - Auto-runs migrations on start

3. **frontend** - React application (Vite)
   - Port: 5173 (Dev) / 80 (Prod)
   - Depends on backend

### Volumes

- `postgres_data` - Database persistence
- `./uploads` - Generated PDF files

## Environment Variables

### Required

- `GROQ_API_KEY` - Your Groq API key

### Optional

- `PORT` - Backend port (default: 3000)
- `NODE_ENV` - Environment (default: production)
- `DATABASE_URL` - Auto-configured in Docker

## Common Commands

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

### Restart Services

```bash
# Restart all
docker compose restart

# Rebuild after code changes
docker compose up -d --build
```

### Stop Services

```bash
# Stop without removing
docker compose stop

# Stop and remove containers
docker compose down

# Remove everything including volumes (⚠️ deletes data)
docker compose down -v
```

### Access Containers

```bash
# Backend container
docker compose exec backend sh

# Database container
docker compose exec postgres sh

# Database CLI
docker compose exec postgres psql -U cvify -d cvify_db
```

## Local Development (Without Docker)

### Install Bun

**Windows:**

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

**Linux/Mac:**

```bash
curl -fsSL https://bun.sh/install | bash
```

### Setup Database

Install PostgreSQL locally or use Docker for database only:

```bash
docker run -d \
  --name cvify-postgres \
  -e POSTGRES_USER=cvify \
  -e POSTGRES_PASSWORD=cvify_password \
  -e POSTGRES_DB=cvify_db \
  -p 5432:5432 \
  postgres:15-alpine
```

### Run Application

**Backend:**

```bash
# Install dependencies
bun install

# Generate Prisma Client
bunx prisma generate

# Run migrations
bunx prisma migrate deploy

# Start development server
bun run start:dev
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

Backend runs at: http://localhost:3000
Frontend runs at: http://localhost:5173

## Production Deployment

### Using Docker Compose (Recommended)

1. Set production environment variables
2. Use strong database password
3. Configure reverse proxy (nginx/traefik)
4. Set up SSL/TLS certificates
5. Configure backups

### Example nginx config

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Security Checklist

- [ ] Change default database password
- [ ] Use strong passwords
- [ ] Enable HTTPS
- [ ] Set up firewall rules
- [ ] Regular backups
- [ ] Monitor logs
- [ ] Keep dependencies updated

## Backup Strategy

### Database Backup

```bash
# Create backup
docker compose exec postgres pg_dump -U cvify cvify_db > backup_$(date +%Y%m%d).sql

# Restore backup
docker compose exec -T postgres psql -U cvify cvify_db < backup_20240101.sql
```

### Files Backup

```bash
# Backup uploads folder
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/
```

### Automated Backups (cron)

```bash
# Add to crontab (daily at 2 AM)
0 2 * * * cd /path/to/cvify && docker compose exec postgres pg_dump -U cvify cvify_db > backup_$(date +\%Y\%m\%d).sql
```

## Troubleshooting

### Port Already in Use

Edit `docker-compose.yml`:

```yaml
services:
  app:
    ports:
      - '8080:3000' # Use different port
```

### Database Connection Failed

```bash
# Check if database is ready
docker compose exec postgres pg_isready -U cvify

# Restart app after database is ready
docker compose restart app
```

### App Not Starting

```bash
# Check logs
docker compose logs app

# Common issues:
# - Missing GROQ_API_KEY
# - Database not ready
# - Port conflict
```

### Reset Everything

```bash
# Nuclear option - removes all data
docker compose down -v
docker compose up -d
```

## Monitoring

### Check Service Health

```bash
docker compose ps
```

### Resource Usage

```bash
docker stats
```

### Disk Usage

```bash
docker system df
```

## Updating

### Update Application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker compose up -d --build
```

### Update Dependencies

```bash
# Update Dockerfile/docker-compose.yml as needed
docker compose up -d --build
```
