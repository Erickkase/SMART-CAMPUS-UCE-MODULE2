export default () => ({
  port: Number(process.env.PORT ?? 8080),
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  authEnabled: (process.env.AUTH_ENABLED ?? 'false') === 'true',
  jwt: {
    secret: process.env.JWT_SECRET ?? 'development-secret',
  },
  services: {
    scholarship: process.env.SCHOLARSHIP_SERVICE_URL ?? 'http://localhost:3000',
    socioeconomic:
      process.env.SOCIOECONOMIC_SERVICE_URL ?? 'http://localhost:3001',
    psychological:
      process.env.PSYCHOLOGICAL_SERVICE_URL ?? 'http://localhost:3002',
  },
});
