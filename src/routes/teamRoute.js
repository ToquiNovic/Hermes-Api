import { Router } from 'express';
import { createTeam, joinTeam, deleteTeam, getTeamInfo } from '../controllers/teamController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/create', createTeam);

router.post('/join', joinTeam);

router.delete('/delete', protect, deleteTeam);

router.get('/user/:userId/team', protect, getTeamInfo);

export default router;
