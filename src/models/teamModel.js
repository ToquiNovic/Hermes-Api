import mongoose from 'mongoose';

const equipoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  codigoInvitacion: {
    type: String,
    required: true,
    unique: true,
  },
  lider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  usuarios: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
  }],
}, { timestamps: true });

export default mongoose.model('Equipo', equipoSchema);
