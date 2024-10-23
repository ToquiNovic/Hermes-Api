import { Router } from 'express';
import { 
  createSensor, 
  addSensorData, 
  getSensorById, 
  getSensorData, 
  updateSensorData, 
  deleteSensorData, 
  deleteSensor 
} from '../controllers/sensorController.js';

const router = Router();

// Route to create a sensor
router.post('/create', createSensor);

// Route to get a sensor and its endpoint
router.get('/:sensorId', getSensorById);

// Route to delete a sensor
router.delete('/:sensorId', deleteSensor);

// Routes to manage sensor data
router.get('/:sensorId/data', getSensorData);
router.post('/:sensorId/data', addSensorData);
router.put('/:sensorId/data/:dataId', updateSensorData);
router.delete('/:sensorId/data/:dataId', deleteSensorData);

export default router;
