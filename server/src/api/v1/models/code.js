import mongoose from 'mongoose';

const codeSchema = new mongoose.Schema({
  value: { type: String, required: true, unique: true },
  clientId: { type: String, required: true },
  redirectUri: { type: String, required: false },
  userId: { type: String, required: true },
});

export default mongoose.model('Code', codeSchema);
