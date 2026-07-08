FROM node:22-alpine AS builder

WORKDIR /app

ARG NEXT_PUBLIC_SCHOLARSHIP_API_URL=/api/scholarships
ARG NEXT_PUBLIC_SOCIOECONOMIC_API_URL=/api/socioeconomic
ARG NEXT_PUBLIC_PSYCHOLOGICAL_API_URL=/api/psychological
ARG NEXT_PUBLIC_APPOINTMENT_API_URL=/api/appointments
ARG NEXT_PUBLIC_API_GATEWAY_URL=/api/gateway
ARG NPM_TOKEN

ENV NEXT_PUBLIC_SCHOLARSHIP_API_URL=$NEXT_PUBLIC_SCHOLARSHIP_API_URL
ENV NEXT_PUBLIC_SOCIOECONOMIC_API_URL=$NEXT_PUBLIC_SOCIOECONOMIC_API_URL
ENV NEXT_PUBLIC_PSYCHOLOGICAL_API_URL=$NEXT_PUBLIC_PSYCHOLOGICAL_API_URL
ENV NEXT_PUBLIC_APPOINTMENT_API_URL=$NEXT_PUBLIC_APPOINTMENT_API_URL
ENV NEXT_PUBLIC_API_GATEWAY_URL=$NEXT_PUBLIC_API_GATEWAY_URL
ENV NPM_TOKEN=$NPM_TOKEN

RUN if [ -z "$NPM_TOKEN" ]; then echo "NPM_TOKEN build arg is required"; exit 1; fi

COPY apps/welfare-frontend/package.json apps/welfare-frontend/package-lock.json apps/welfare-frontend/.npmrc ./
RUN npm ci

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
