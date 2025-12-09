#!/bin/bash

# ============================================================
# Directus Docker Quick Starter Setup Script
# Works on Linux, macOS, and Windows (Git Bash/WSL/MSYS2)
# ============================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory (works on both Windows and Linux)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}       Directus Docker Quick Starter Setup${NC}"
echo -e "${BLUE}============================================================${NC}"
echo ""

# ============================================================
# Prompt for project prefix
# ============================================================
echo -e "${YELLOW}Enter your project prefix (e.g., 'interview', 'myapp'):${NC}"
read -r PROJECT_PREFIX

# Validate input
if [[ -z "$PROJECT_PREFIX" ]]; then
    echo -e "${RED}Error: Project prefix cannot be empty${NC}"
    exit 1
fi

# Convert to lowercase and remove spaces/special chars
PROJECT_PREFIX=$(echo "$PROJECT_PREFIX" | tr '[:upper:]' '[:lower:]' | tr -cd '[:alnum:]_-')

echo -e "${GREEN}Using project prefix: ${PROJECT_PREFIX}${NC}"
echo ""

# ============================================================
# Prompt for admin credentials
# ============================================================
echo -e "${YELLOW}Enter admin email (default: admin@${PROJECT_PREFIX}.local):${NC}"
read -r ADMIN_EMAIL
ADMIN_EMAIL=${ADMIN_EMAIL:-"admin@${PROJECT_PREFIX}.local"}

echo -e "${YELLOW}Enter admin password (leave empty to generate):${NC}"
read -rs ADMIN_PASSWORD
echo ""

# ============================================================
# Generate secure random strings
# ============================================================
generate_password() {
    local length=${1:-32}
    # Cross-platform random string generation
    if command -v openssl &> /dev/null; then
        openssl rand -hex "$((length/2))" 2>/dev/null || cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w "$length" | head -n 1
    elif [[ -f /dev/urandom ]]; then
        cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w "$length" | head -n 1
    else
        # Fallback for Windows without openssl
        date +%s%N | sha256sum | base64 | head -c "$length"
    fi
}

echo -e "${BLUE}Generating secure credentials...${NC}"

POSTGRES_PASSWORD=$(generate_password 32)
KEYDB_PASSWORD=$(generate_password 32)
MINIO_ACCESS_KEY=$(generate_password 20)
MINIO_SECRET_KEY=$(generate_password 40)
DIRECTUS_SECRET=$(generate_password 64)

# Generate admin password if not provided
if [[ -z "$ADMIN_PASSWORD" ]]; then
    ADMIN_PASSWORD=$(generate_password 16)
    echo -e "${GREEN}Generated admin password: ${ADMIN_PASSWORD}${NC}"
    echo -e "${YELLOW}Please save this password!${NC}"
fi

echo ""

# ============================================================
# Define container and volume names with prefix
# ============================================================
POSTGRES_CONTAINER="${PROJECT_PREFIX}_postgres"
KEYDB_CONTAINER="${PROJECT_PREFIX}_keydb"
MINIO_CONTAINER="${PROJECT_PREFIX}_minio"
MINIO_INIT_CONTAINER="${PROJECT_PREFIX}_minio_init"
MAILHOG_CONTAINER="${PROJECT_PREFIX}_mailhog"
DIRECTUS_CONTAINER="${PROJECT_PREFIX}_directus"

POSTGRES_VOLUME="${PROJECT_PREFIX}_postgres_data"
KEYDB_VOLUME="${PROJECT_PREFIX}_keydb_data"
MINIO_VOLUME="${PROJECT_PREFIX}_minio_data"
MAILHOG_VOLUME="${PROJECT_PREFIX}_mailhog_data"
DIRECTUS_VOLUME="${PROJECT_PREFIX}_uploads_data"

# Database name and user based on project
DB_NAME="${PROJECT_PREFIX}"
DB_USER="${PROJECT_PREFIX}"
MINIO_BUCKET="${PROJECT_PREFIX}"

# ============================================================
# Backup existing .env if it exists
# ============================================================
if [[ -f ".env" ]]; then
    BACKUP_NAME=".env.backup.$(date +%Y%m%d_%H%M%S)"
    echo -e "${YELLOW}Backing up existing .env to ${BACKUP_NAME}${NC}"
    cp ".env" "$BACKUP_NAME"
fi

# ============================================================
# Create .env from template
# ============================================================
echo -e "${BLUE}Creating .env file from template...${NC}"

if [[ ! -f ".env.example" ]]; then
    echo -e "${RED}Error: .env.example not found${NC}"
    exit 1
fi

cp ".env.example" ".env"

# ============================================================
# Update .env file with generated values
# Cross-platform sed (works on both GNU and BSD sed)
# ============================================================
sed_inplace() {
    if sed --version 2>/dev/null | grep -q GNU; then
        sed -i "$@"
    else
        sed -i '' "$@"
    fi
}

echo -e "${BLUE}Updating .env with project configuration...${NC}"

# PostgreSQL settings
sed_inplace "s|^POSTGRES_DB=\"\"|POSTGRES_DB=\"${DB_NAME}\"|" .env
sed_inplace "s|^POSTGRES_USER=\"\"|POSTGRES_USER=\"${DB_USER}\"|" .env
sed_inplace "s|^POSTGRES_PASSWORD=\"\"|POSTGRES_PASSWORD=\"${POSTGRES_PASSWORD}\"|" .env

# KeyDB settings
sed_inplace "s|^KEYDB_PASSWORD=\"\"|KEYDB_PASSWORD=\"${KEYDB_PASSWORD}\"|" .env

# Redis password (must match KeyDB)
sed_inplace "s|^REDIS_PASSWORD=\"\"|REDIS_PASSWORD=\"${KEYDB_PASSWORD}\"|" .env
sed_inplace "s|^REDIS_HOST=\"keydb\"|REDIS_HOST=\"${KEYDB_CONTAINER}\"|" .env

# MinIO settings
sed_inplace "s|^MINIO_ACCESS_KEY=\"\"|MINIO_ACCESS_KEY=\"${MINIO_ACCESS_KEY}\"|" .env
sed_inplace "s|^MINIO_SECRET_KEY=\"\"|MINIO_SECRET_KEY=\"${MINIO_SECRET_KEY}\"|" .env
sed_inplace "s|^MINIO_BUCKET=\"\"|MINIO_BUCKET=\"${MINIO_BUCKET}\"|" .env

# Database connection (Directus)
sed_inplace "s|^DB_HOST=\"directus-postgres\"|DB_HOST=\"${POSTGRES_CONTAINER}\"|" .env
sed_inplace "s|^DB_DATABASE=\"directus\"|DB_DATABASE=\"${DB_NAME}\"|" .env
sed_inplace "s|^DB_USER=\"directus\"|DB_USER=\"${DB_USER}\"|" .env
sed_inplace "s|^DB_PASSWORD=\"directus\"|DB_PASSWORD=\"${POSTGRES_PASSWORD}\"|" .env

# Directus secret
sed_inplace "s|^SECRET=\"\"|SECRET=\"${DIRECTUS_SECRET}\"|" .env

# Storage settings (must match MinIO)
sed_inplace "s|^STORAGE_MINIO_KEY=\"minioadmin\"|STORAGE_MINIO_KEY=\"${MINIO_ACCESS_KEY}\"|" .env
sed_inplace "s|^STORAGE_MINIO_SECRET=\"minioadmin\"|STORAGE_MINIO_SECRET=\"${MINIO_SECRET_KEY}\"|" .env
sed_inplace "s|^STORAGE_MINIO_BUCKET=\"directus\"|STORAGE_MINIO_BUCKET=\"${MINIO_BUCKET}\"|" .env
sed_inplace "s|http://minio:9000|http://${MINIO_CONTAINER}:9000|g" .env

# Email settings
sed_inplace "s|^EMAIL_SMTP_HOST=\"mailhog\"|EMAIL_SMTP_HOST=\"${MAILHOG_CONTAINER}\"|" .env
sed_inplace "s|^EMAIL_FROM=\"admin@directus.local\"|EMAIL_FROM=\"admin@${PROJECT_PREFIX}.local\"|" .env

# Admin credentials
sed_inplace "s|^ADMIN_EMAIL=\"admin@example.com\"|ADMIN_EMAIL=\"${ADMIN_EMAIL}\"|" .env
sed_inplace "s|^ADMIN_PASSWORD=\"password\"|ADMIN_PASSWORD=\"${ADMIN_PASSWORD}\"|" .env

# Cache namespace
sed_inplace "s|^CACHE_NAMESPACE=\"directus_cache\"|CACHE_NAMESPACE=\"${PROJECT_PREFIX}_cache\"|" .env

echo -e "${GREEN}.env file updated successfully${NC}"

# ============================================================
# Update Docker Compose YAML files
# ============================================================
echo -e "${BLUE}Updating Docker Compose files...${NC}"

# Function to update YAML files
update_yaml() {
    local file="$1"
    
    if [[ ! -f "$file" ]]; then
        echo -e "${YELLOW}Warning: $file not found, skipping${NC}"
        return
    fi
    
    echo -e "  Updating ${file}..."
    
    # Create temp file for modifications
    local temp_file="${file}.tmp"
    cp "$file" "$temp_file"
    
    # Update based on file
    case "$file" in
        *postgres.yml)
            sed_inplace "s|container_name: postgres|container_name: ${POSTGRES_CONTAINER}|g" "$temp_file"
            sed_inplace "s|name: directus_postgres_data|name: ${POSTGRES_VOLUME}|g" "$temp_file"
            # Update labels
            sed_inplace "s|com.interview.|com.${PROJECT_PREFIX}.|g" "$temp_file"
            ;;
        *keydb.yml)
            sed_inplace "s|container_name: keydb|container_name: ${KEYDB_CONTAINER}|g" "$temp_file"
            sed_inplace "s|name: directus_keydb_data|name: ${KEYDB_VOLUME}|g" "$temp_file"
            sed_inplace "s|com.interview.|com.${PROJECT_PREFIX}.|g" "$temp_file"
            ;;
        *minio.yml)
            sed_inplace "s|container_name: minio|container_name: ${MINIO_CONTAINER}|g" "$temp_file"
            sed_inplace "s|container_name: minio-init|container_name: ${MINIO_INIT_CONTAINER}|g" "$temp_file"
            sed_inplace "s|name: directus_minio_data|name: ${MINIO_VOLUME}|g" "$temp_file"
            sed_inplace "s|com.interview.|com.${PROJECT_PREFIX}.|g" "$temp_file"
            # Update service references
            sed_inplace "s|http://minio:9000|http://${MINIO_CONTAINER}:9000|g" "$temp_file"
            sed_inplace "s|myminio http://minio:|myminio http://${MINIO_CONTAINER}:|g" "$temp_file"
            ;;
        *mailhog.yml)
            sed_inplace "s|container_name: mailhog|container_name: ${MAILHOG_CONTAINER}|g" "$temp_file"
            sed_inplace "s|name: directus_mailhog_data|name: ${MAILHOG_VOLUME}|g" "$temp_file"
            sed_inplace "s|com.interview.|com.${PROJECT_PREFIX}.|g" "$temp_file"
            ;;
        *directus.yml)
            sed_inplace "s|container_name: directus|container_name: ${DIRECTUS_CONTAINER}|g" "$temp_file"
            sed_inplace "s|name: directus_uploads_data|name: ${DIRECTUS_VOLUME}|g" "$temp_file"
            sed_inplace "s|com.interview.|com.${PROJECT_PREFIX}.|g" "$temp_file"
            ;;
    esac
    
    mv "$temp_file" "$file"
}

# Update all YAML files
update_yaml "docker/postgres/postgres.yml"
update_yaml "docker/keydb/keydb.yml"
update_yaml "docker/minio/minio.yml"
update_yaml "docker/mailhog/mailhog.yml"
update_yaml "docker/directus/directus.yml"

echo -e "${GREEN}Docker Compose files updated successfully${NC}"

# ============================================================
# Create/Update fe/.env for frontend configuration
# ============================================================
echo -e "${BLUE}Creating fe/.env file for frontend...${NC}"

FE_ENV_FILE="fe/.env"

# Backup existing fe/.env if it exists
if [[ -f "$FE_ENV_FILE" ]]; then
    FE_BACKUP_NAME="fe/.env.backup.$(date +%Y%m%d_%H%M%S)"
    echo -e "${YELLOW}Backing up existing fe/.env to ${FE_BACKUP_NAME}${NC}"
    cp "$FE_ENV_FILE" "$FE_BACKUP_NAME"
fi

# Create the fe/.env file with comments
cat > "$FE_ENV_FILE" << EOF
# ============================================================
# Frontend Environment Configuration
# Generated by setup.sh for project: ${PROJECT_PREFIX}
# ============================================================

# Logging Configuration
# Options: debug, info, warn, error
LOGGER_LEVEL=info

# Directus API Configuration
# URL where the Directus CMS is accessible
DIRECTUS_URL=http://localhost:8055

# Directus API Token
# Generate a static token in Directus Admin > Settings > Access Tokens
# Leave empty initially and update after creating a token in Directus
DIRECTUS_TOKEN=

EOF

echo -e "${GREEN}fe/.env file created successfully${NC}"

# ============================================================
# Update depends_on references in directus.yml
# ============================================================
echo -e "${BLUE}Updating service dependencies...${NC}"

# The depends_on in directus.yml references service names, not container names
# Service names stay the same (postgres, keydb, minio), so no changes needed there

# ============================================================
# Summary
# ============================================================
echo ""
echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}       Setup Complete!${NC}"
echo -e "${GREEN}============================================================${NC}"
echo ""
echo -e "${BLUE}Project Prefix:${NC} ${PROJECT_PREFIX}"
echo ""
echo -e "${BLUE}Container Names:${NC}"
echo "  PostgreSQL:  ${POSTGRES_CONTAINER}"
echo "  KeyDB:       ${KEYDB_CONTAINER}"
echo "  MinIO:       ${MINIO_CONTAINER}"
echo "  MailHog:     ${MAILHOG_CONTAINER}"
echo "  Directus:    ${DIRECTUS_CONTAINER}"
echo ""
echo -e "${BLUE}Volume Names:${NC}"
echo "  PostgreSQL:  ${POSTGRES_VOLUME}"
echo "  KeyDB:       ${KEYDB_VOLUME}"
echo "  MinIO:       ${MINIO_VOLUME}"
echo "  Directus:    ${DIRECTUS_VOLUME}"
echo ""
echo -e "${BLUE}Credentials:${NC}"
echo "  Database:    ${DB_USER} / ${POSTGRES_PASSWORD}"
echo "  KeyDB:       ${KEYDB_PASSWORD}"
echo "  MinIO:       ${MINIO_ACCESS_KEY} / ${MINIO_SECRET_KEY}"
echo "  Admin:       ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}"
echo ""
echo -e "${YELLOW}Important: Save these credentials securely!${NC}"
echo ""
echo -e "${BLUE}To start the services, run:${NC}"
echo "  docker compose up -d"
echo ""
echo -e "${BLUE}To view logs:${NC}"
echo "  docker compose logs -f"
echo ""
echo -e "${BLUE}Access points:${NC}"
echo "  Directus:    http://localhost:8055"
echo "  MinIO UI:    http://localhost:9001"
echo "  MailHog UI:  http://localhost:8025"
echo ""
echo -e "${YELLOW}All credentials have been saved to the .env file.${NC}"
echo ""
echo -e "${BLUE}Frontend Configuration (fe/.env):${NC}"
echo "  Logger Level:  info"
echo "  Directus URL:  http://localhost:8055"
echo "  Directus Token: (empty - generate in Directus Admin)"
echo ""
echo -e "${YELLOW}Note: After Directus is running, create an access token in${NC}"
echo -e "${YELLOW}Directus Admin > Settings > Access Tokens and update fe/.env${NC}"
echo ""
