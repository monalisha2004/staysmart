const User = require("../models/User");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password_hash");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, preferences } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name !== undefined) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (preferences !== undefined) user.preferences = preferences.trim();

    await user.save();

    const { password_hash, ...safeUser } = user.toObject();
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
const suspendUser = async (req, res) => { try { const { reason } = req.body;
 if (!reason || !reason.trim()) { return res.status(400).json({ message: "Suspension reason is required" });
 } 
 const user = await User.findById(req.params.id); 
 if (!user) { return res.status(404).json({ message: "User not found" }); 
} 
user.status = "suspended";
 user.suspension_reason = reason.trim();
  user.suspended_at = new Date();
   await user.save();
    const { password_hash, ...safeUser } = user.toObject(); 
    res.json({ message: "User suspended", user: safeUser });
 } catch (err)
  { 
    res.status(500).json({ message: "Server error", error: err.message });
 } 
};

module.exports = { getProfile, updateProfile, suspendUser };