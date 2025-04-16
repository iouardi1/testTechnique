# Test Technique Repository

A complete user management system with CRUD operations and photo upload functionality.

## Features

- User listing with profile pictures
- Create, update, and delete users
- Photo upload and display
- PostgreSQL database for data storage
- Docker containers for easy deployment

## Requirements

- Docker
- Docker Compose

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3002

## Manual Setup

```bash
# Build and start containers
cd backend
npm i
docker-compose build
docker-compose up -d
```

## Development

### Frontend

The frontend is a React application with:
- User management interface
- Photo upload capabilities
- Form validation

### Backend

The backend is a Node.js application with:
- RESTful API for user management
- File upload handling
- PostgreSQL database connection

### Database

PostgreSQL database with:
- User table including profile picture support
- Automatic schema creation on startup

## Stopping the Application

```bash
docker-compose down
```

## Troubleshooting

If you encounter issues:

1. Check container logs:
```bash
docker-compose logs -f
```

2. Ensure all containers are running:
```bash
docker-compose ps
```

3. Restart the containers:
```bash
docker-compose restart
```
