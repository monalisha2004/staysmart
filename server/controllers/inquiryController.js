const Inquiry = require("../models/Inquiry");
const Property = require("../models/Property");

const DUPLICATE_WINDOW_HOURS = 24;

const createInquiry = async (req, res) => {
  try {
    const { propertyId, message, contact_preference } = req.body;

    if (!propertyId || !message || !contact_preference) {
      return res.status(400).json({ message: "propertyId, message, and contact_preference are required" });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const windowStart = new Date(Date.now() - DUPLICATE_WINDOW_HOURS * 60 * 60 * 1000);
    const recentDuplicate = await Inquiry.findOne({
      property_id: propertyId,
      user_id: req.user.id,
      message: message.trim(),
      createdAt: { $gte: windowStart },
    });

    if (recentDuplicate) {
      return res.status(400).json({ message: "You already sent this exact inquiry recently. Please wait before sending it again." });
    }

    const inquiry = await Inquiry.create({
      property_id: propertyId,
      user_id: req.user.id,
      message: message.trim(),
      contact_preference,
    });

    res.status(201).json(inquiry);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getMyInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ user_id: req.user.id }).populate("property_id").sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getInquiriesForOwner = async (req, res) => {
  try {
    const myProperties = await Property.find({ owner_id: req.user.id }).select("_id");
    const propertyIds = myProperties.map((p) => p._id);

    const inquiries = await Inquiry.find({ property_id: { $in: propertyIds } })
      .populate("property_id")
      .populate("user_id", "name email phone")
      .sort({ createdAt: -1 });

    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["new", "contacted", "closed"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const inquiry = await Inquiry.findById(req.params.id).populate("property_id");
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    if (inquiry.property_id.owner_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: this inquiry is not on your property" });
    }

    inquiry.status = status;
    await inquiry.save();
    res.json(inquiry);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { createInquiry, getMyInquiries, getInquiriesForOwner, updateInquiryStatus };