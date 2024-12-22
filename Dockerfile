FROM node:20.17.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p /app/node_modules/.vite-temp && \
    chown -R node:node /app

USER node

CMD ["npm", "run", "dev"]
