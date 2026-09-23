const express = require("express");
const router = express.Router();
const {
  createProperty,
  getProperties,
  getMyProperties,
  getPropertyById,
  updateProperty,
  updateStatus,
  uploadImages,
} = require("../controllers/propertyController");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/", protect, authorize("owner"), createProperty);
router.get("/", getProperties);
router.get("/mine", protect, authorize("owner"), getMyProperties);
router.get("/:id", getPropertyById);
router.put("/:id", protect, authorize("owner"), updateProperty);
router.put("/:id/status", protect, authorize("owner"), updateStatus);
router.post("/:id/images", protect, authorize("owner"), upload.array("images", 6), uploadImages);

module.exports = router;