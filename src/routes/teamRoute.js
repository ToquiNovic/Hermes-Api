import { Router } from 'express';
import { createTeam, joinTeam, deleteTeam } from '../controllers/teamController.js';

const router = Router();

// Route to create a team
router.post('/create', createTeam);

// Route to join a team
router.post('/join', joinTeam);

// Route to delete a team (only leader)
router.delete('/delete', deleteTeam);

export default router;
