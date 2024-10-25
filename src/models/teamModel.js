import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  codeInvitation: {
    type: String,
    required: true,
    unique: true,
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  sensors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sensor',
  }],
}, { timestamps: true });

export default mongoose.model('Team', teamSchema);
