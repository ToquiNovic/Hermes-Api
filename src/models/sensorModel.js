import mongoose from 'mongoose';

const sensorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  equipo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipo',
    required: true,
  },
  datos: [{
    valor: mongoose.Schema.Types.Mixed,
    timestamp: {
      type: Date,
      default: Date.now
    },
  }],
}, { timestamps: true });

export default mongoose.model('Sensor', sensorSchema);
