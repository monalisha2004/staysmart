const express = require("express");
const router = express.Router();
const {
  createInquiry,
  getMyInquiries,
  getInquiriesForOwner,
  updateInquiryStatus,
} = require("../controllers/inquiryController");
const { protect, authorize } = require("../middleware/auth");

router.post("/", protect, createInquiry);
router.get("/mine", protect, getMyInquiries);
router.get("/owner", protect, authorize("owner"), getInquiriesForOwner);
router.put("/:id/status", protect, authorize("owner"), updateInquiryStatus);

module.exports = router;