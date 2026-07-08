import { Router } from 'express';

const router = Router();

const MOCK_USER = {
  email: 'admin@welfare.uce.edu.ec',
  password: 'admin123',
};

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === MOCK_USER.email && password === MOCK_USER.password) {
    return res.json({
      token: 'mock-jwt-token-welfare-desktop',
      user: { email: MOCK_USER.email, name: 'Admin Welfare' },
    });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
});

export { router as authRouter };
