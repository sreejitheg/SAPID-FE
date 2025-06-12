# ─────────────────────────────
# 0. Base image for all stages
# ─────────────────────────────
FROM node:18-alpine AS base
WORKDIR /app
# native-add-on toolchain + glibc shim for some npm packages
RUN apk add --no-cache libc6-compat python3 make g++

ENV NEXT_TELEMETRY_DISABLED 1
# ------------------------------------------------------------------

# ─────────────────────────────
# 1. Install ALL deps (dev+prod)
# ─────────────────────────────
FROM base AS deps
COPY package.json package-lock.json* ./
# --legacy-peer-deps avoids peer-dep conflicts in some React/TW stacks
RUN npm ci --legacy-peer-deps
# ------------------------------------------------------------------

# ─────────────────────────────
# 2. Build phase
# ─────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Compile Next.js (or Vite, PostCSS etc.)
RUN npm run build

# After the build succeeds, strip dev-only packages to slim the next stage
RUN npm prune --omit=dev
# ------------------------------------------------------------------

# ─────────────────────────────
# 3. Runtime image (minimal)
# ─────────────────────────────
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

# Non-root user for security
RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001
USER nextjs

# Copy only what we need from the builder
COPY --from=builder /app/public        ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static  ./.next/static

EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]   # produced by `next build --output standalone`
