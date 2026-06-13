FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY nest-cli.json tsconfig*.json ./
COPY apps/psychological-care-service ./apps/psychological-care-service

RUN npx nest build psychological-care-service

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=development

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3002

CMD ["node", "dist/apps/psychological-care-service/main.js"]
