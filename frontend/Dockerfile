FROM node:20

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev"]


# # 1. Build stage
# FROM node:20 AS builder

# WORKDIR /app
# COPY package*.json ./
# RUN npm install

# COPY . .
# RUN npm run build

# # 2. Serve static files with nginx
# FROM nginx:alpine AS production

# # Copy build output
# COPY --from=builder /app/dist /usr/share/nginx/html

# # Copy custom nginx config if needed
# # COPY nginx.conf /etc/nginx/nginx.conf

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
