import { Router } from 'express';
import { 
  updatePassword, 
  getUserById, 
  updateUserInfo, 
  deleteUser, 
  getAllUsers 
} from '../controllers/userController.js';

const router = Router();

// Route to update password
router.put('/update-password', updatePassword);

// Route to get user by ID
router.get('/:userId', getUserById);

// Route to update user info
router.put('/:userId', updateUserInfo);

// Route to delete a user
router.delete('/:userId', deleteUser);

// Route to get all users (for admin purposes)
router.get('/', getAllUsers);

export default router;
