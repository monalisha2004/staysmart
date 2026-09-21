const express = require("express");
const router = express.Router();
const {
  createProperty,
  getMyProperties,
  getPropertyById,
  updateProperty,
  updateStatus,
} = require("../controllers/propertyController");
const { protect, authorize } = require("../middleware/auth");

router.post("/", protect, authorize("owner"), createProperty);
router.get("/mine", protect, authorize("owner"), getMyProperties);
router.get("/:id", getPropertyById);
router.put("/:id", protect, authorize("owner"), updateProperty);
router.put("/:id/status", protect, authorize("owner"), updateStatus);

module.exports = router;