const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: {
    type: String,
    enum: ["ngo", "restaurant", "admin"],
    required: true,
  },
  blocked: { type: Boolean, default: false },

  // NGO-specific fields
  ngo_name: { type: String, unique: true, sparse: true },
  registration_number: { type: String, unique: true, sparse: true },
  ngo_phone: { type: String, unique: true, sparse: true },
  ngo_location: {
    type: {
      type: String,
      enum: ["Point"],
      default: undefined, // 🚀 prevents empty object
    },
    coordinates: {
      type: [Number],
      default: undefined, // 🚀 prevents []
    },
  },

  // Restaurant-specific fields
  restaurant_name: { type: String, unique: true, sparse: true },
  license_number: { type: String, unique: true, sparse: true },
  restaurant_phone: { type: String, unique: true, sparse: true },
  restaurant_location: {
    type: {
      type: String,
      enum: ["Point"],
      default: undefined, // 🚀 prevents empty object
    },
    coordinates: {
      type: [Number],
      default: undefined, // 🚀 prevents []
    },
  },

  // resetPassword
  resetPasswordToken: String,
  resetPasswordExpires: Date,

  createdAt: { type: Date, default: Date.now },
});

// Geo index for faster queries (nearby NGOs/Restaurants)
UserSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", UserSchema);
