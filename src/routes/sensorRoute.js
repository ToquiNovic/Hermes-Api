import { Router } from 'express';
import { 
  createSensor, 
  addSensorData, 
  getSensorById, 
  getSensorData, 
  updateSensorData, 
  deleteSensorData, 
  deleteSensor,
  getUserTeamSensors,
  getSensorDetailData
} from '../controllers/sensorController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

// Route to create a sensor
router.post('/create', protect, createSensor);

// Route to get a sensor and its endpoint
router.get('/:sensorId', getSensorById);

// Route to delete a sensor
router.delete('/:sensorId', deleteSensor);

// Routes to manage sensor data
router.get('/:sensorId/data', getSensorData);
router.post('/:sensorId/data', addSensorData);
router.put('/:sensorId/data/:dataId', updateSensorData);
router.delete('/:sensorId/data/:dataId', deleteSensorData);
router.get('/user/:userId/sensors', getUserTeamSensors);
router.get('/:sensorId/data/:dataId', getSensorDetailData);

export default router;
