const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },                  // User's name
  email: { type: String, required: true, unique: true },       // Email address
  password: { type: String },                                   // Password (optional for security reasons)
  firstName: { type: String },                                  // First name (optional)
  lastName: { type: String },                                   // Last name (optional)
  createdAt: { type: Date, default: Date.now },                // Timestamp for when the user was created
  updatedAt: { type: Date },                                    // Timestamp for when the user was last updated (optional)
  isActive: { type: Boolean, default: true },                  // Status indicating if the user is active
  isVerified: { type: Boolean, default: true },                 // Status indicating if the user is verified
  roles: { type: [String], default: ['user'] },                // Array of roles assigned to the user (e.g., 'admin', 'user')
});

userSchema.plugin(AutoIncrement, { inc_field: 'id' }); // 'id' will auto-increment

const User = mongoose.model('User', userSchema);
module.exports = User;
