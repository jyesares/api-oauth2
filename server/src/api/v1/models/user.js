import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.methods.verifyPassword = function verifyPassword(password) {
  return password === this.password;
};

export default mongoose.model('User', userSchema);
