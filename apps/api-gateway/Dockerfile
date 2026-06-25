FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY nest-cli.json tsconfig*.json ./
COPY apps/api-gateway ./apps/api-gateway

RUN npx nest build api-gateway

FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=development

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 8080

CMD ["node", "dist/apps/api-gateway/main.js"]
