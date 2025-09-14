const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//SignUp
exports.signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      userType,
      // NGO fields
      ngo_name,
      registration_number,
      ngo_phone,
      ngo_location,
      // Restaurant fields
      restaurant_name,
      license_number,
      restaurant_phone,
      restaurant_location,
    } = req.body;

    if (!userType) {
      return res.status(400).json({ message: "userType is required" });
    }

    if (userType === "admin") {
      if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required" });
      }
    } else if (userType === "ngo") {
      if (!ngo_name || !registration_number || !ngo_phone || !ngo_location) {
        return res
          .status(400)
          .json({ message: "All NGO fields are required." });
      }
    } else if (userType === "restaurant") {
      if (
        !restaurant_name ||
        !license_number ||
        !restaurant_phone ||
        !restaurant_location
      ) {
        return res
          .status(400)
          .json({ message: "All Restaurant fields are required." });
      }
    } else {
      return res.status(400).json({ message: "Invalid user type." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    let phoneToCheck;
    if (userType === "ngo") {
      phoneToCheck = ngo_phone;
    } else if (userType === "restaurant") {
      phoneToCheck = restaurant_phone;
    }

    if (phoneToCheck) {
      const existingNumber = await User.findOne({
        $or: [{ ngo_phone: phoneToCheck }, { restaurant_phone: phoneToCheck }],
      });
      if (existingNumber) {
        return res.status(400).json({ message: "Phone Number already taken" });
      }
    }

    let registrationToCheck;
    if (userType === "ngo") {
      registrationToCheck = registration_number;
    } else if (userType === "restaurant") {
      registrationToCheck = license_number;
    }

    if (registrationToCheck) {
      const existingRegistration = await User.findOne({
        $or: [
          { registration_number: registrationToCheck },
          { license_number: registrationToCheck },
        ],
      });
      if (existingRegistration) {
        return res
          .status(400)
          .json({ message: "Registration Number already Taken" });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Base user data
    let userData = {
      name,
      email,
      password: hashedPassword,
      userType,
    };

    // Append role-specific fields
    if (userType === "ngo") {
      Object.assign(userData, {
        ngo_name,
        registration_number,
        ngo_phone,
        ngo_location: ngo_location, // frontend should send {lat, lng}
      });
    } else if (userType === "restaurant") {
      Object.assign(userData, {
        restaurant_name,
        license_number,
        restaurant_phone,
        restaurant_location: restaurant_location, // frontend should send {lat, lng}
      });
    }

    // Save user
    const user = await User.create(userData);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "An error occurred",
    });
  }
};

//Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.blocked) {
      return res
        .status(403)
        .json({ message: "You account is blocked by admim" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    let location = null;
    if (user.userType === "restaurant") {
      location = user.restaurant_location; // { lat, lng }
    } else if (user.userType === "ngo") {
      location = user.ngo_location; // { lat, lng }
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        user: {
          id: user._id,
          role: user.userType,
          email: user.email,
          name: user.name,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: "10d" }
    );

    // Return success response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        location, // now this has {lat, lng} for restaurants
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//UpdatePassword
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; // Extracted from the JWT token

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Verify the current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Current password is incorrect." });
    }

    // Validate the new password
    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "New password must be at least 8 characters long." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Forgot Password - Validate Phone and Allow Frontend to Proceed
exports.forgotPassword = async (req, res) => {
  try {
    const { ngo_phone, restaurant_phone } = req.body;

    if (!ngo_phone && !restaurant_phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Build dynamic $or query
    const query = {
      $or: [],
    };

    if (ngo_phone) query.$or.push({ ngo_phone });
    if (restaurant_phone) query.$or.push({ restaurant_phone });

    const foundUser = await User.findOne(query);

    if (!foundUser) {
      return res
        .status(404)
        .json({ message: "No user found with this phone number" });
    }

    res.status(200).json({
      message: "Phone number verified. Proceed to reset password.",
      userId: foundUser._id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error processing forgot password request",
      error: error.message,
    });
  }
};

// Reset Password - After Phone is Verified
exports.resetPassword = async (req, res) => {
  try {
    const { userId, newPassword, confirmPassword } = req.body;
    console.log("Received body:", req.body);

    if (!userId || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({
      message: "Error resetting password",
      error: error.message,
    });
  }
};
