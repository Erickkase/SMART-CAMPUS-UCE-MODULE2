"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRouter = void 0;
const axios_1 = __importDefault(require("axios"));
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.healthRouter = router;
const SERVICES = [
    { name: 'scholarship', url: process.env.SCHOLARSHIP_API_URL || 'http://localhost:3000' },
    { name: 'socioeconomic-form', url: process.env.SOCIOECONOMIC_API_URL || 'http://localhost:3001' },
    { name: 'psychological-care', url: process.env.PSYCHOLOGICAL_API_URL || 'http://localhost:3003' },
    { name: 'student', url: process.env.STUDENT_API_URL || 'http://localhost:3006' },
    { name: 'subject', url: process.env.SUBJECT_API_URL || 'http://localhost:3004' },
    { name: 'enrollment', url: process.env.ENROLLMENT_API_URL || 'http://localhost:3005' },
];
router.get('/', async (_req, res) => {
    const results = await Promise.allSettled(SERVICES.map((svc) => axios_1.default
        .get(`${svc.url}/health`, { timeout: 3000 })
        .then(() => ({ service: svc.name, status: 'ok' }))
        .catch(() => ({ service: svc.name, status: 'unreachable' }))));
    const services = results.map((r) => r.status === 'fulfilled' ? r.value : { service: 'unknown', status: 'error' });
    const overall = services.every((s) => s.status === 'ok') ? 'ok' : 'degraded';
    res.json({ status: overall, services });
});
//# sourceMappingURL=health.js.map