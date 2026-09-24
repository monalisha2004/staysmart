const mongoose = require("mongoose");

const favouriteSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    property_id: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  },
  { timestamps: true }
);

// Enforces the brief's rule: "Favourite pair must be unique per user and property."
// This is a compound unique index — MongoDB itself will reject a duplicate combination,
// so the rule is enforced at the database level, not just in application code.
favouriteSchema.index({ user_id: 1, property_id: 1 }, { unique: true });

module.exports = mongoose.model("Favourite", favouriteSchema);