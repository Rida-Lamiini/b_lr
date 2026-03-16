#!/bin/sh

# Push any pending Prisma database changes
# We use db push instead of migrate deploy because we are using SQLite and dev.db
npx prisma db push

# Start the standalone Next.js server
node server.js
