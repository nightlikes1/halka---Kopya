# ==============================================================================
# Multi-Stage Dockerfile for Halka Life OS (Vanilla TypeScript + Vite)
# ==============================================================================

# Stage 1: Build Phase
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies cleanly
RUN npm ci

# Copy application source code
COPY . .

# Build Arguments (Can be passed during `docker build --build-arg ...`)
ARG VITE_SUPABASE_URL=https://zaoqiqenolmuwltqgjzq.supabase.co
ARG VITE_SUPABASE_ANON_KEY=sb_publishable_rKGZzSo0yShq_O1twxxgPw_a9Ae-_0g

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Compile TypeScript and bundle production assets with Vite
RUN npm run build

# Stage 2: Production Nginx Server
FROM nginx:alpine

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx SPA configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled production bundle from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
