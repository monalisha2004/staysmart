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

const getProperties = async (req, res) => {
  try {
    const { city, locality, title, minRent, maxRent, type, furnishing, occupancy, sort, page = 1, limit = 10 } = req.query;

    const filter = { status: "published" };

    if (city) filter.city = new RegExp(city, "i");
    if (locality) filter.locality = new RegExp(locality, "i");
    if (title) filter.title = new RegExp(title, "i");
    if (type) filter.type = new RegExp(type, "i");
    if (furnishing) filter.furnishing = furnishing;
    if (occupancy) filter.occupancy = new RegExp(occupancy, "i");

    if (minRent || maxRent) {
      filter.rent = {};
      if (minRent) filter.rent.$gte = Number(minRent);
      if (maxRent) filter.rent.$lte = Number(maxRent);
    }

    let sortOption = { createdAt: -1 };
    if (sort === "rent_asc") sortOption = { rent: 1 };
    if (sort === "rent_desc") sortOption = { rent: -1 };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const [properties, total] = await Promise.all([
      Property.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Property.countDocuments(filter),
    ]);

    res.json({
      properties,
      pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
    });
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

module.exports = { createProperty, getProperties, getMyProperties, getPropertyById, updateProperty, updateStatus, uploadImages };