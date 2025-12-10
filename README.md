# Directus Docker Starter

A ready-to-use Directus CMS setup with Docker for local development.

## Configuration

### Environment variables
- **Documentation**: [Official Directus config options](https://docs.directus.io/self-hosted/config-options.html#file-storage)
- **Template**: See `.env.example` for all available configuration options

## Development

### Project structure

```
/docker - Docker files for local development services
  /directus - Directus service configuration
  /keydb - KeyDB (Redis-compatible) service configuration
  /mailhog - MailHog email testing service configuration
  /minio - MinIO S3-compatible object storage configuration
  /postgres - PostgreSQL database configuration

docker-compose.yml - Docker compose configuration for local development
docker-compose.dev.yml - Development override with extension hot reloading
Dockerfile - Build docker image with extensions
```

### Local development setup

#### Prerequisites
Before running the project locally, ensure that:
- Docker and Docker Compose are installed
- Required ports are available (check `docker-compose.yml` for specific ports)
- No conflicting Docker networks or volumes exist
- Container names are unique across your Docker environment

#### Environment configuration

##### Quick setup (recommended)
Use the automated setup script to configure your environment with a project prefix:

```bash
chmod +x setup.sh
./setup.sh
```

> **Windows users**: Run this script using Git Bash, WSL, or MSYS2.

The setup script will:
- Prompt for a project prefix (e.g., `interview`, `myapp`)
- Generate secure passwords for PostgreSQL, KeyDB, MinIO, and Directus
- Update all container and volume names with your prefix
- Create a `.env` file with all configurations populated

##### Manual configuration
1. **Copy the environment template**: 
   ```bash
   cp .env.example .env
   ```
2. **Edit `.env`** and configure the required variables
3. **Ensure all Directus configuration variables are set** before starting

#### Running the project

##### Production/testing mode (built extensions)
For running with pre-built extensions (similar to production):

1. **Start all services**:
   ```bash
   docker compose up -d
   ```

2. **Verify services are running**:
   ```bash
   docker compose ps
   ```

The setup should work out of the box once environment variables are properly configured. The Docker Compose configuration includes all necessary services:
- **Directus CMS** - Main application
- **PostgreSQL** - Database
- **KeyDB** - Redis-compatible cache/session storage
- **MinIO** - S3-compatible object storage for file uploads
- **MailHog** - Email testing service for development
