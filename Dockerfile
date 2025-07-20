# Stage 1: Build
FROM node:20 AS builder
WORKDIR /app

# Copy project files
COPY . .

# Install dependencies
RUN npm install

# Build with Vite (uses .env.production automatically)
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
