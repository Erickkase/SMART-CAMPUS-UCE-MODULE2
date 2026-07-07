// Maps environment variables into typed psychological-care-service configuration values.
export default () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3003),
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  authEnabled: (process.env.AUTH_ENABLED ?? 'false') === 'true',
  jwt: {
    secret: process.env.JWT_SECRET ?? 'development-secret',
    issuer: process.env.JWT_ISSUER ?? 'smart-campus-uce',
    audience: process.env.JWT_AUDIENCE ?? 'psychological-care-service',
  },
  databaseEnabled:
    (process.env.DB_ENABLED ??
      (process.env.NODE_ENV === 'production' ? 'true' : 'false')) === 'true',
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    name: process.env.DB_NAME ?? 'psychological_care_db',
    synchronize: (process.env.DB_SYNCHRONIZE ?? 'false') === 'true',
    logging: (process.env.DB_LOGGING ?? 'false') === 'true',
  },
  mqtt: {
    enabled: (process.env.MQTT_ENABLED ?? 'false') === 'true',
    brokerUrl: process.env.MQTT_BROKER_URL ?? 'mqtt://localhost:1883',
    clientId: process.env.MQTT_CLIENT_ID ?? 'psychological-care-service',
  },
  rabbitmq: {
    enabled: (process.env.RABBITMQ_ENABLED ?? 'false') === 'true',
    url: process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672',
    exchange: process.env.RABBITMQ_EXCHANGE ?? 'welfare.events',
  },
  kafka: {
    enabled: (process.env.KAFKA_ENABLED ?? 'false') === 'true',
    brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9094').split(','),
    clientId: process.env.KAFKA_CLIENT_ID ?? 'psychological-care-service',
    topics: {
      scholarshipEvents:
        process.env.KAFKA_TOPIC_SCHOLARSHIP_EVENTS ?? 'scholarship.events',
    },
  },
});
