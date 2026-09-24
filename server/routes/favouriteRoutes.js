const express = require("express");
const router = express.Router();
const { addFavourite, removeFavourite, getMyFavourites } = require("../controllers/favouriteController");
const { protect } = require("../middleware/auth");

router.post("/", protect, addFavourite);
router.delete("/:propertyId", protect, removeFavourite);
router.get("/", protect, getMyFavourites);

module.exports = router;