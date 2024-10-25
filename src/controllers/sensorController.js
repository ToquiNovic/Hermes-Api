import mongoose from 'mongoose';
import Sensor from '../models/sensorModel.js';
import Team from '../models/teamModel.js';
import User from '../models/userModel.js';

export const createSensor = async (req, res) => {
  const { name, teamId, data } = req.body;

  try {
    // Validar que el teamId sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ message: 'Invalid teamId' });
    }

    // Buscar el equipo por su ID
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
 
    // Validar que 'data' tenga el formato correcto
    if (!Array.isArray(data) || !data.every(d => d.name && d.value)) {
      return res.status(400).json({ message: 'Data must contain a list of entries with name and value' });
    }

    // Crear el nuevo sensor
    const newSensor = new Sensor({
      name,
      team: teamId,
      data,
    });

    await newSensor.save();

    // Añadir el sensor al equipo
    team.sensors.push(newSensor._id);
    await team.save();

    // Devolver la respuesta de éxito
    res.status(201).json({ message: 'Sensor created successfully', sensor: newSensor });
  } catch (error) {
    console.error('Error creating sensor:', error);
    res.status(500).json({ message: 'Error creating sensor', error: error.message });
  }
};

// Get a sensor by ID (To generate the full URL)
export const getSensorById = async (req, res) => {
  const { sensorId } = req.params;

  try {
    // Verificar si el ID proporcionado es válido
    if (!mongoose.Types.ObjectId.isValid(sensorId)) {
      return res.status(400).json({ message: 'Invalid sensor ID' });
    }

    // Buscar el sensor en la base de datos
    const sensor = await Sensor.findById(sensorId);
    if (!sensor) {
      return res.status(404).json({ message: 'Sensor not found' });
    }

    // Construir el endpoint completo y añadirlo a los datos del sensor
    const endpoint = `${req.protocol}://${req.get('host')}/api/sensor/${sensor._id}/data`;

    // Responder con el sensor y el endpoint completo
    res.status(200).json({ message: 'Sensor found', sensor, endpoint });
  } catch (error) {
    console.error('Error fetching sensor:', error);
    res.status(500).json({ message: 'Error fetching sensor', error: error.message });
  }
};

export const getUserTeamSensors = async (req, res) => {
  const { userId } = req.params;

  try {
    // Buscar al usuario por su ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verificar si el usuario pertenece a un equipo
    if (!user.team) {
      return res.status(404).json({ message: 'User does not belong to any team' });
    }

    // Buscar el equipo del usuario y popular los sensores
    const team = await Team.findById(user.team).populate('sensors');
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Agregar la URL completa al `endpoint` de cada sensor
    const sensors = team.sensors.map(sensor => ({
      ...sensor._doc,
      endpoint: `${req.protocol}://${req.get('host')}/api/sensor/${sensor._id}/data`
    }));

    // Responder con los sensores actualizados
    res.status(200).json({
      message: 'Sensors retrieved successfully',
      sensors
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sensors', error: error.message });
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
    // Verificar si el ID proporcionado es válido
    if (!mongoose.Types.ObjectId.isValid(sensorId)) {
      return res.status(400).json({ message: 'Invalid sensor ID' });
    }

    // Buscar el sensor en la base de datos
    const sensor = await Sensor.findById(sensorId);
    if (!sensor) {
      return res.status(404).json({ message: 'Sensor not found' });
    }

    // Construir el endpoint completo y agregarlo al objeto sensor
    sensor._doc.endpoint = `${req.protocol}://${req.get('host')}/api/sensor/${sensorId}/data`;

    // Responder con el objeto sensor, incluyendo el endpoint
    res.status(200).json({ sensor: sensor._doc });
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    res.status(500).json({ message: 'Error fetching sensor data', error: error.message });
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
  const { sensorId, dataId } = req.params; // Obtenemos sensorId y dataId de los parámetros de la URL
  const { newValue } = req.body; // El nuevo valor se envía en el cuerpo de la solicitud

  try {
    // Buscar el sensor por su ID
    const sensor = await Sensor.findById(sensorId);
    if (!sensor) {
      return res.status(404).json({ message: 'Sensor not found' });
    }

    // Buscar el dato dentro del array data usando el dataId
    const data = sensor.data.id(dataId);
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // Agregar el valor actual al historial antes de actualizar
    data.history.push({
      value: data.value,  // Almacena el valor anterior
      timestamp: data.timestamp,  // Almacena el timestamp anterior
    });

    // Actualizar el valor actual y el timestamp
    data.value = newValue;
    data.timestamp = new Date(); // Usar una nueva fecha en lugar de Date.now()

    // Guardar el sensor actualizado
    await sensor.save();

    res.status(200).json({ message: 'Sensor data updated', sensor });
  } catch (error) {
    res.status(500).json({ message: 'Error updating sensor data', error });
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

export const getSensorDetailData = async (req, res) => {
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

    // Devuelve la información sin eliminar
    res.status(200).json({ message: 'Data retrieved successfully', data });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving data' });
  }
};
