const Favourite = require("../models/Favourite");

const addFavourite = async (req, res) => {
  try {
    const { propertyId } = req.body;
    if (!propertyId) {
      return res.status(400).json({ message: "propertyId is required" });
    }

    const favourite = await Favourite.create({ user_id: req.user.id, property_id: propertyId });
    res.status(201).json(favourite);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Property already in favourites" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const removeFavourite = async (req, res) => {
  try {
    const favourite = await Favourite.findOneAndDelete({ user_id: req.user.id, property_id: req.params.propertyId });
    if (!favourite) {
      return res.status(404).json({ message: "Favourite not found" });
    }
    res.json({ message: "Removed from favourites" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getMyFavourites = async (req, res) => {
  try {
    const favourites = await Favourite.find({ user_id: req.user.id }).populate("property_id");
    res.json(favourites);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { addFavourite, removeFavourite, getMyFavourites };