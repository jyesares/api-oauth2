import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  clientId: { type: String, required: true },
  clientSecret: { type: String, required: true },
  userId: { type: String, required: true },
});

clientSchema.methods.verifySecret = function verifySecret(clientSecret) {
  return clientSecret === this.clientSecret;
};

export default mongoose.model('Client', clientSchema);
