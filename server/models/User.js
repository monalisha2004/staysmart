const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String, required: true },
    role: { type: String, enum: ["tenant", "owner", "admin"], required: true },
    phone: { type: String, trim: true },
    preferences: { type: String, trim: true },
    status: { type: String, enum: ["active", "suspended"], default: "active" },
    suspension_reason: { type: String, default: null },
    suspended_at: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);