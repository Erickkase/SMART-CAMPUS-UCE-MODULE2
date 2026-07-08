FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY nest-cli.json tsconfig*.json ./
COPY apps/appointment-service ./apps/appointment-service

RUN npx nest build appointment-service

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=development

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3008

CMD ["node", "dist/apps/appointment-service/main.js"]
