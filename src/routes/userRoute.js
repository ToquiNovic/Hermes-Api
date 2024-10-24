import { Router } from 'express';
import { getAllUsers, updatePassword, getUserById, updateUserInfo, deleteUser } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { checkRole } from '../middlewares/checkRole.js';

const router = Router();

// Ruta accesible solo por administradores
router.get('/', protect, checkRole('admin'), getAllUsers);

// Ruta para actualizar contraseña (accesible por el propio usuario)
router.put('/update-password', protect, updatePassword);

// Ruta para obtener información del usuario (por admin o por el propio usuario)
router.get('/:userId', protect, getUserById);

// Ruta para actualizar información (solo admin o el propio usuario)
router.put('/:userId', protect, updateUserInfo);

// Ruta para eliminar usuario (solo admin)
router.delete('/:userId', protect, checkRole('admin'), deleteUser);

export default router;
