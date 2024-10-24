import { Router } from 'express';
import { register, login, refreshToken, registerAndCreateTeam, registerAndJoinTeamWithCode } from '../controllers/authController.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/register-with-team', registerAndCreateTeam);
router.post('/register-and-join', registerAndJoinTeamWithCode);

export default router;
