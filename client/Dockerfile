FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

ARG REACT_APP_SERVER_PROTOCOL=http
ARG REACT_APP_SERVER_IP=127.0.0.1
ARG REACT_APP_SERVER_PORT=8443

RUN REACT_APP_SERVER_PROTOCOL=$REACT_APP_SERVER_PROTOCOL \
    REACT_APP_SERVER_IP=$REACT_APP_SERVER_IP \
    REACT_APP_SERVER_PORT=$REACT_APP_SERVER_PORT \
    npm run build

RUN npm install -g serve

# Copy and set up entrypoint script and config injector
COPY docker-entrypoint.sh /usr/local/bin/
COPY inject-config.js /app/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh /app/inject-config.js

# Environment variables for runtime configuration
ENV REACT_APP_SERVER_PROTOCOL=http
ENV REACT_APP_SERVER_IP=127.0.0.1
ENV REACT_APP_SERVER_PORT=8443

ENTRYPOINT ["docker-entrypoint.sh"]

EXPOSE 3000
