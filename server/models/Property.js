const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    rent: { type: Number, required: true, min: 0 },
    deposit: { type: Number, required: true, min: 0 },
    city: { type: String, required: true, trim: true },
    locality: { type: String, required: true, trim: true },
    furnishing: { type: String, enum: ["unfurnished", "semi-furnished", "furnished"], required: true },
    occupancy: { type: String, required: true, trim: true },
    facilities: [{ type: String }],
    images: [{ type: String }],
    status: { type: String, enum: ["draft", "published", "occupied", "archived"], default: "draft" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);