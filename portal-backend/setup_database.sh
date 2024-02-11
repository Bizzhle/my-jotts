#!/bin/bash
set -e

# Configuration
DB_NAME="activitystepsdb"
DB_USER="admin"
DB_PASSWORD="admin"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL is not installed. Please install it first."
    exit 1
fi

# Check if the database already exists
if psql -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
    echo "Database $DB_NAME already exists. Skipping setup."
    exit 0
fi

# Set environment variables for PostgreSQL credentials
export PGUSER=postgres
export PGPASSWORD=postgres

# Create database and user
echo "Creating database and user..."
psql -w -c "CREATE DATABASE $DB_NAME;"
psql -w -c "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';"
psql -w -c "ALTER USER $DB_USER WITH CREATEDB;"


# Grant privileges
echo "Granting privileges..."
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

echo "Database setup complete!"
