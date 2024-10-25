import mongoose from 'mongoose';

const sensorDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  value: mongoose.Schema.Types.Mixed,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  history: [{
    value: mongoose.Schema.Types.Mixed,  // Almacenar el valor antiguo
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
});

const sensorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  data: [sensorDataSchema],
}, { timestamps: true });

export default mongoose.model('Sensor', sensorSchema);
