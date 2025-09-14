const User = require("../models/User");

// ✅ Get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const updates = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.userType === "restaurant") {
      // Restaurant fields
      user.restaurant_name = updates.restaurant_name || user.restaurant_name;
      user.license_number = updates.license_number || user.license_number;
      user.restaurant_phone = updates.restaurant_phone || user.restaurant_phone;

      if (updates.restaurant_location) {
        user.restaurant_location = updates.restaurant_location;
      }
    } else if (user.userType === "ngo") {
      // NGO fields
      user.ngo_name = updates.ngo_name || user.ngo_name;
      user.registration_number =
        updates.registration_number || user.registration_number;
      user.ngo_phone = updates.ngo_phone || user.ngo_phone;

      if (updates.ngo_location) {
        user.ngo_location = updates.ngo_location;
      }
    }

    await user.save();
    res.json(user);
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ msg: "Server error" });
  }
};



exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // from JWT

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Include location based on user type
    let location = null;
    if (user.userType === "restaurant") location = user.restaurant_location;
    if (user.userType === "ngo") location = user.ngo_location;

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        location,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};