# Stage 1: Build the React app
FROM node:20-alpine AS builder
WORKDIR /app

# Vite bakes VITE_* vars into the bundle at build time — pass them as build args
ARG VITE_API_BASE_URL=http://localhost:3001
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_GA_TRACKING_ID

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_GA_TRACKING_ID=$VITE_GA_TRACKING_ID

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve the built output with nginx
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
