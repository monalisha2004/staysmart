const express = require("express");
const router = express.Router();
const { getProfile, updateProfile, suspendUser } = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");

router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);
router.put("/:id/suspend", protect, authorize("admin"), suspendUser);

module.exports = router;