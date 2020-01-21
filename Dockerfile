# IMPORTANT: #
# Any change to this file should be also applied to Dockerfile.INT and Dockerfile.QA
FROM node:10 As build
WORKDIR /app
COPY package.json yarn.lock ./

# Download dependencies
RUN yarn

# Copy source files
COPY . .

# Run tests and verify other requirements
RUN yarn verify

# Build project
RUN yarn build

# Host project in nginx
FROM nginx:1.17.7-alpine
WORKDIR /app
COPY --from=build /app/build /usr/share/nginx/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]
EXPOSE 80 443
