FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY nest-cli.json tsconfig*.json ./
COPY apps/subject-service ./apps/subject-service

RUN npx nest build subject-service

FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=development

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3004

CMD ["node", "dist/apps/subject-service/main.js"]
