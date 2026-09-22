# Step 1: Base image — lightweight Alpine Linux with Node.js 20
FROM node:20-alpine

# Step 2: Set working directory inside the container
WORKDIR /app

# Step 3: Copy dependency manifests first for optimal layer caching
COPY package.json package-lock.json ./

# Step 4: Install dependencies deterministically via npm ci
# Note: python3, make, and g++ are temporarily installed to compile native addons (e.g., bcrypt)
# on Alpine (musl libc), then deleted in the same layer to minimize final image size.
RUN apk add --no-cache python3 make g++ \
    && npm ci --omit=dev \
    && apk del python3 make g++

# Step 5: Copy the remaining source code (after dependencies are cached)
COPY . .

# Step 6: Set environment variables
ENV NODE_ENV=production
ENV PORT=8000

# Step 7: Expose container port
EXPOSE 8000

# Step 8: Start application directly with Node (not nodemon)
CMD ["node", "app.js"]
