const Property = require("../models/Property");

const createProperty = async (req, res) => {
  try {
    const { title, type, rent, deposit, city, locality, furnishing, occupancy, facilities } = req.body;

    if (!title || !type || !rent || !deposit || !city || !locality || !furnishing || !occupancy) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const property = await Property.create({
      owner_id: req.user.id,
      title: title.trim(),
      type: type.trim(),
      rent,
      deposit,
      city: city.trim(),
      locality: locality.trim(),
      furnishing,
      occupancy: occupancy.trim(),
      facilities: facilities || [],
    });

    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner_id: req.user.id }).sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.owner_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: you do not own this property" });
    }

    const fields = ["title", "type", "rent", "deposit", "city", "locality", "furnishing", "occupancy", "facilities"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) property[field] = req.body[field];
    });

    await property.save();
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["draft", "published", "occupied", "archived"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.owner_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: you do not own this property" });
    }

    property.status = status;
    await property.save();
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const uploadImages = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.owner_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: you do not own this property" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const newImagePaths = req.files.map((file) => `/uploads/${file.filename}`);
    property.images = [...property.images, ...newImagePaths];

    await property.save();
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { createProperty, getMyProperties, getPropertyById, updateProperty, updateStatus, uploadImages };