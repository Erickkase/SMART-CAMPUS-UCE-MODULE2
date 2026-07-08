import cors from 'cors';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { authRouter } from './routes/auth';
import { healthRouter } from './routes/health';

export function createServer(port: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.use('/api/health', healthRouter);
    app.use('/api/auth', authRouter);

    const proxyOpts = (target: string) => ({
      target,
      changeOrigin: true,
      on: {
        error: (err: Error) => {
          console.error(`[proxy] error -> ${target}:`, err.message);
        },
      },
    });

    app.use(
      '/api/socioeconomic-forms',
      createProxyMiddleware(proxyOpts(process.env.SOCIOECONOMIC_API_URL || 'http://localhost:3001')),
    );
    app.use(
      '/api/scholarships',
      createProxyMiddleware(proxyOpts(process.env.SCHOLARSHIP_API_URL || 'http://localhost:3000')),
    );
    app.use(
      '/api/psychological-care',
      createProxyMiddleware(proxyOpts(process.env.PSYCHOLOGICAL_API_URL || 'http://localhost:3003')),
    );
    app.use(
      '/api/students',
      createProxyMiddleware(proxyOpts(process.env.STUDENT_API_URL || 'http://localhost:3006')),
    );
    app.use(
      '/api/subjects',
      createProxyMiddleware(proxyOpts(process.env.SUBJECT_API_URL || 'http://localhost:3004')),
    );
    app.use(
      '/api/enrollments',
      createProxyMiddleware(proxyOpts(process.env.ENROLLMENT_API_URL || 'http://localhost:3005')),
    );

    const server = app.listen(port, () => {
      console.log(`[server] Express proxy running on http://localhost:${port}`);
      resolve(port);
    });
    server.on('error', reject);
  });
}
