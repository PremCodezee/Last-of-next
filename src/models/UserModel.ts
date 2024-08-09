import mongoose, { model, models } from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isLogin: {
      type: Boolean,
      default: false,
  },
});

const User = models.User || model('User', UserSchema);

export default User;
