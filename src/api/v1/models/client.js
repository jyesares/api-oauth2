import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  clientId: { type: String, required: true },
  clientSecret: { type: String, required: true },
});

export default mongoose.model('Client', clientSchema);
