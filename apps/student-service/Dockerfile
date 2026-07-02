FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY nest-cli.json tsconfig*.json ./
COPY apps/student-service ./apps/student-service

RUN npx nest build student-service

FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=development

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3006

CMD ["node", "dist/apps/student-service/main.js"]
