import { Router } from 'express';

import authRoutes from './authRoute.js'; 
import routerUser from './userRoute.js'; 
import routerTeam from './teamRoute.js'; 
import routerSensor from './sensorRoute.js'; 

const router = Router();

router.use('/auth', authRoutes);

router.use('/user',  routerUser);
router.use('/team', routerTeam);
router.use('/sensor', routerSensor);

export default router;
