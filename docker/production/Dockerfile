FROM node:20-alpine AS base

# 1. Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --update --no-cache libc6-compat python3 make g++ && rm -rf /var/cache/apk/*

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock ./
COPY prisma ./prisma/

RUN yarn config set network-timeout 900000 -g && yarn --frozen-lockfile;

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# This will do the trick, use the corresponding env file for each environment.
COPY .env.production.example .env.production

RUN yarn build && \
    yarn next-swagger-doc-cli next-swagger-doc.json

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

# Ensure logs directory is created under the correct permissions
RUN mkdir logs && \
    chmod 755 logs && \
    chown nextjs:nodejs logs

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["sh", "-c", "npx --yes prisma migrate deploy --schema=./prisma/schema.prisma && node server.js"]
