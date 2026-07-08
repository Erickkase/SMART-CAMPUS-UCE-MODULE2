FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY nest-cli.json tsconfig*.json ./
COPY apps/student-request-service ./apps/student-request-service

RUN npx nest build student-request-service

FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=development

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3010

CMD ["node", "dist/apps/student-request-service/main.js"]
