export default () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3008),
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  authEnabled: (process.env.AUTH_ENABLED ?? 'false') === 'true',
  jwt: {
    secret: process.env.JWT_SECRET ?? 'development-secret',
    issuer: process.env.JWT_ISSUER ?? 'smart-campus-uce',
    audience: process.env.JWT_AUDIENCE ?? 'appointment-service',
  },
  databaseEnabled:
    (process.env.DB_ENABLED ??
      (process.env.NODE_ENV === 'production' ? 'true' : 'false')) === 'true',
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    name: process.env.DB_NAME ?? 'appointment_db',
    synchronize: (process.env.DB_SYNCHRONIZE ?? 'false') === 'true',
    logging: (process.env.DB_LOGGING ?? 'false') === 'true',
  },
  studentValidationEnabled:
    (process.env.STUDENT_VALIDATION_ENABLED ?? 'true') === 'true',
  services: {
    student: process.env.STUDENT_SERVICE_URL ?? 'http://localhost:3006',
  },
});
