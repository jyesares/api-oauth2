import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  expiresIn: { type: String, required: true },
  tokenType: { type: String, required: true },
  clientId: { type: String, required: true },
});

export default mongoose.model('Token', tokenSchema);
