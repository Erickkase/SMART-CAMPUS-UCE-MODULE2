FROM node:22-alpine AS builder

WORKDIR /app

ARG NEXT_PUBLIC_SCHOLARSHIP_API_URL
ARG NEXT_PUBLIC_SOCIOECONOMIC_API_URL

ENV NEXT_PUBLIC_SCHOLARSHIP_API_URL=$NEXT_PUBLIC_SCHOLARSHIP_API_URL
ENV NEXT_PUBLIC_SOCIOECONOMIC_API_URL=$NEXT_PUBLIC_SOCIOECONOMIC_API_URL

COPY apps/welfare-frontend/package*.json ./
RUN npm install

COPY apps/welfare-frontend ./

RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3002

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3002

CMD ["node", "server.js"]
