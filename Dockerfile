FROM node:20-slim

RUN apt-get update && apt-get install -y \
    chromium \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libnss3 \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

CMD ["npm", "start"]