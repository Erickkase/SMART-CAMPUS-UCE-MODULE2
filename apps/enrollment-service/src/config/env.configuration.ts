export default () => ({
  port: Number(process.env.PORT ?? 3005),
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  databaseEnabled:
    (process.env.DB_ENABLED ??
      (process.env.NODE_ENV === 'production' ? 'true' : 'false')) === 'true',
  database: {
    host: process.env.DB_HOST ?? 'enrollment-postgres',
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    name: process.env.DB_NAME ?? 'enrollment_db',
    synchronize: (process.env.DB_SYNCHRONIZE ?? 'true') === 'true',
    logging: (process.env.DB_LOGGING ?? 'false') === 'true',
  },
});
