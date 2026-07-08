"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Missing or invalid authorization header' });
        return;
    }
    const token = authHeader.split(' ')[1];
    if (token !== 'mock-jwt-token-welfare-desktop') {
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
    next();
}
//# sourceMappingURL=auth.js.map