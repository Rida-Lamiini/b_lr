# 1. Base stage
FROM node:20-alpine AS base
WORKDIR /app
# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# 2. Dependencies stage
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# 3. Builder stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the Next.js standalone app
RUN npm run build

# 4. Runner stage
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy exactly what we need for Next.js standalone
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy Prisma schema and migrations so we can db push on startup if needed
COPY --from=builder /app/prisma ./prisma
# Copy the start script
COPY scripts/start-docker.sh ./start.sh
RUN chmod +x ./start.sh

EXPOSE 3000

CMD ["./start.sh"]
