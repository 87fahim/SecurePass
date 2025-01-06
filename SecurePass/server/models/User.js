// password-manager/server/models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  publicKey: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
export default User; // Use `export default` instead of `module.exports`
