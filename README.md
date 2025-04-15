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

## Quick Start

1. Clone the repository
2. Run the setup script:

```bash
./setup.sh
```

The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:3002

## Manual Setup

If you prefer to run the setup manually:

```bash
# Build and start containers
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
