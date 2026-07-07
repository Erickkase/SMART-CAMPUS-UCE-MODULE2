export default () => ({
  port: Number(process.env.PORT ?? 8080),
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  authEnabled: (process.env.AUTH_ENABLED ?? 'false') === 'true',
  rateLimit: {
    ttl: Number(process.env.RATE_LIMIT_TTL ?? 60000),
    limit: Number(process.env.RATE_LIMIT_LIMIT ?? 30),
  },
  circuitBreaker: {
    timeoutMs: Number(process.env.CIRCUIT_BREAKER_TIMEOUT_MS ?? 5000),
    failureThreshold: Number(process.env.CIRCUIT_BREAKER_FAILURE_THRESHOLD ?? 3),
    resetTimeoutMs: Number(process.env.CIRCUIT_BREAKER_RESET_TIMEOUT_MS ?? 15000),
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'development-secret',
  },
  services: {
    scholarship: process.env.SCHOLARSHIP_SERVICE_URL ?? 'http://localhost:3000',
    socioeconomic:
      process.env.SOCIOECONOMIC_SERVICE_URL ?? 'http://localhost:3001',
    psychological:
      process.env.PSYCHOLOGICAL_SERVICE_URL ?? 'http://localhost:3002',
    subject: process.env.SUBJECT_SERVICE_URL ?? 'http://localhost:3004',
    enrollment: process.env.ENROLLMENT_SERVICE_URL ?? 'http://localhost:3005',
    student: process.env.STUDENT_SERVICE_URL ?? 'http://localhost:3006',
    appointment: process.env.APPOINTMENT_SERVICE_URL ?? 'http://localhost:3008',
  },
});
