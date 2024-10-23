import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  equipo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipo',
  },
  esLider: {
    type: Boolean,
    default: false, // Solo será true si el usuario crea el equipo
  },
}, { timestamps: true });

export default mongoose.model('Usuario', usuarioSchema);
