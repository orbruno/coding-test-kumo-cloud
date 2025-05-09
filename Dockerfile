# ─── BUILD STAGE ───────────────────────────────────────────────────────────────
FROM node:18-alpine AS builder
WORKDIR /app

# 1) Copy only what we need to install + build
COPY package.json .
COPY tsconfig.json vite.config.ts .
COPY index.html .
COPY src ./src

# 2) Install & build
RUN npm install
RUN npm run build   # runs `vite build` → outputs into /app/dist

# ─── PRODUCTION STAGE ─────────────────────────────────────────────────────────
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy the built files from the builder stage
COPY --from=builder /app/dist . 

# Expose port 80 and run nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
