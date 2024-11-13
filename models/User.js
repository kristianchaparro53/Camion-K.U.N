const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  shift: String,
  busNumber: String,
  codigo: String,
  phoneNumber: { type: String, required: true }, // Nuevo campo para el número de teléfono
  googleId: String,
});

module.exports = mongoose.model('User', UserSchema);
