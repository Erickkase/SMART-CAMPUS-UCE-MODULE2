// Maps environment variables into typed socioeconomic-form-service configuration values.
export default () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3002),
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  mongoEnabled:
    (process.env.MONGO_ENABLED ??
      (process.env.NODE_ENV === 'production' ? 'true' : 'false')) === 'true',
  mongoUri:
    process.env.MONGODB_URI ?? 'mongodb://localhost:27017/socioeconomic_forms',
});
