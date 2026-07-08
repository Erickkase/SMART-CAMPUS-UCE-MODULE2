"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = createServer;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const auth_1 = require("./routes/auth");
const health_1 = require("./routes/health");
function createServer(port) {
    return new Promise((resolve, reject) => {
        const app = (0, express_1.default)();
        app.use((0, cors_1.default)());
        app.use(express_1.default.json());
        app.use('/api/health', health_1.healthRouter);
        app.use('/api/auth', auth_1.authRouter);
        const proxyOpts = (target) => ({
            target,
            changeOrigin: true,
            on: {
                error: (err) => {
                    console.error(`[proxy] error -> ${target}:`, err.message);
                },
            },
        });
        app.use('/api/socioeconomic-forms', (0, http_proxy_middleware_1.createProxyMiddleware)(proxyOpts(process.env.SOCIOECONOMIC_API_URL || 'http://localhost:3001')));
        app.use('/api/scholarships', (0, http_proxy_middleware_1.createProxyMiddleware)(proxyOpts(process.env.SCHOLARSHIP_API_URL || 'http://localhost:3000')));
        app.use('/api/psychological-care', (0, http_proxy_middleware_1.createProxyMiddleware)(proxyOpts(process.env.PSYCHOLOGICAL_API_URL || 'http://localhost:3003')));
        app.use('/api/students', (0, http_proxy_middleware_1.createProxyMiddleware)(proxyOpts(process.env.STUDENT_API_URL || 'http://localhost:3006')));
        app.use('/api/subjects', (0, http_proxy_middleware_1.createProxyMiddleware)(proxyOpts(process.env.SUBJECT_API_URL || 'http://localhost:3004')));
        app.use('/api/enrollments', (0, http_proxy_middleware_1.createProxyMiddleware)(proxyOpts(process.env.ENROLLMENT_API_URL || 'http://localhost:3005')));
        const server = app.listen(port, () => {
            console.log(`[server] Express proxy running on http://localhost:${port}`);
            resolve(port);
        });
        server.on('error', reject);
    });
}
//# sourceMappingURL=index.js.map