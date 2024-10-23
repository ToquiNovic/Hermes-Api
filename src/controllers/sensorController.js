import Sensor from '../models/sensorModel.js';
import Team from '../models/teamModel.js';

// Create a sensor for a team
export const createSensor = async (req, res) => {
  const { name, teamId, data } = req.body;

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const newSensor = new Sensor({
      name,
      team: teamId,
      data,
    });

    await newSensor.save();

    // Add the sensor to the team
    team.sensors.push(newSensor._id);
    await team.save();

    res.status(201).json({ message: 'Sensor created successfully', sensor: newSensor });
  } catch (error) {
    res.status(500).json({ message: 'Error creating sensor' });
  }
};

// Get a sensor by ID (To generate the URL)
export const getSensorById = async (req, res) => {
  const { sensorId } = req.params;

  try {
    const sensor = await Sensor.findById(sensorId);
    if (!sensor) {
      return res.status(404).json({ message: 'Sensor not found' });
    }

    // Devolver solo el endpoint relativo para los datos del sensor
    const endpoint = `/api/sensor/${sensorId}/data`;

    res.status(200).json({ message: 'Sensor found', sensor, endpoint });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sensor' });
  }
};


// Delete a sensor
export const deleteSensor = async (req, res) => {
  const { sensorId } = req.params;

  try {
    const sensor = await Sensor.findById(sensorId);
    if (!sensor) {
      return res.status(404).json({ message: 'Sensor not found' });
    }

    await Sensor.findByIdAndDelete(sensorId);
    res.status(200).json({ message: 'Sensor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting sensor' });
  }
};

// CRUD for sensor data (Get, add, update, delete)
export const getSensorData = async (req, res) => {
  const { sensorId } = req.params;

  try {
    const sensor = await Sensor.findById(sensorId);
    if (!sensor) {
      return res.status(404).json({ message: 'Sensor not found' });
    }

    res.status(200).json({ data: sensor.data });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sensor data' });
  }
};

export const addSensorData = async (req, res) => {
  const { sensorId } = req.params;
  const { value } = req.body;

  try {
    const sensor = await Sensor.findById(sensorId);
    if (!sensor) {
      return res.status(404).json({ message: 'Sensor not found' });
    }

    sensor.data.push({ value, timestamp: Date.now() });
    await sensor.save();

    res.status(200).json({ message: 'Data added successfully', sensor });
  } catch (error) {
    res.status(500).json({ message: 'Error adding data to sensor' });
  }
};

export const updateSensorData = async (req, res) => {
  const { sensorId, dataId } = req.params;
  const { value } = req.body;

  try {
    const sensor = await Sensor.findById(sensorId);
    if (!sensor) {
      return res.status(404).json({ message: 'Sensor not found' });
    }

    const data = sensor.data.id(dataId);
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    data.value = value;
    await sensor.save();

    res.status(200).json({ message: 'Data updated successfully', sensor });
  } catch (error) {
    res.status(500).json({ message: 'Error updating data' });
  }
};

export const deleteSensorData = async (req, res) => {
  const { sensorId, dataId } = req.params;

  try {
    const sensor = await Sensor.findById(sensorId);
    if (!sensor) {
      return res.status(404).json({ message: 'Sensor not found' });
    }

    const data = sensor.data.id(dataId);
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    data.remove();
    await sensor.save();

    res.status(200).json({ message: 'Data deleted successfully', sensor });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting data' });
  }
};
