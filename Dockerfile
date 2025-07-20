# Stage 1: Build
FROM node:24 AS builder
WORKDIR /app

# Copy only package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Build with Vite (uses .env.production automatically)
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx static files
RUN rm -rf ./*

# Copy built app
COPY --from=builder /app/dist ./

# Optional: custom nginx config
# Ensure nginx.conf exists in your project root
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
