import { Router } from 'express';
import { register, login, refreshToken, registerAndCreateTeam } from '../controllers/authController.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/register-with-team', registerAndCreateTeam);

export default router;
