const Donation = require("../models/Donation");
const ClaimRequest = require("../models/ClaimRequest");
const Activity = require("../models/Activity");
const User = require("../models/User");

// Create a new donation (Restaurant only)
exports.createDonation = async (req, res) => {
  try {
    const { item, quantity, unit, expiry_time, pickup_address } = req.body;

    // Validation
    if (!item || !unit || !quantity || !expiry_time || !pickup_address) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be positive" });
    }
    if (new Date(expiry_time) <= new Date()) {
      return res
        .status(400)
        .json({ message: "Expiry time must be in the future" });
    }

    const restaurant = await User.findById(req.user.id)

    const donation = new Donation({
      donor: req.user.id,
      item,
      quantity,
      unit,
      expiry_time,
      pickup_address,
      pickup_location: restaurant.restaurant_location,
    });

    await donation.save();

    await Activity.create({
      user: req.user.id,
      message: `you added ${donation.quantity} ${donation.unit} of ${donation.item} for donation`,
      relatedDonation: donation._id,
    });

    res.status(201).json(donation);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating donation", error: error.message });
  }
};

// Get all donations (filter by status if needed)
exports.getAllDonations = async (req, res) => {
  try {
    // Mark expired donations
    await Donation.updateMany(
      {
        expiry_time: { $lt: new Date() },
        status: { $in: ["available", "pending_pickup"] },
      },
      { $set: { status: "expired" } }
    );

    const { status } = req.query;
    let filter = {};

    if (status) {
      filter.status = status;

      if (status === "delivered" && req.user.role === "ngo") {
        filter.ngo_id = req.user.id;
      }
    }

    if (req.user.role === "restaurant") {
      filter.donor = req.user.id;
    }

    const donations = await Donation.find(filter)
      .populate("donor", "name email restaurant_name")
      .populate("ngo_id", "name email ngo_name")
      .sort({ createdAt: -1 });

    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donations", error: error.message });
  }
};



// Get a single donation by ID
exports.getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate("donor", "name email")
      .populate("ngo_id", "name email");
    if (!donation)
      return res.status(404).json({ message: "Donation not found" });
    res.status(200).json(donation);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donation", error });
  }
};

// Admin updates donation status (Approve/Deliver/Reject)
exports.updateDonationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }
    const statusTransitions = {
      available: ["pending_pickup"],
      pending_pickup: ["delivered", "available"],
      delivered: [],
      expired: [],
    };

    // Check if transition is allowed
    if (!statusTransitions[donation.status]?.includes(status)) {
      return res.status(400).json({
        message: `Cannot transition from ${donation.status} to ${status}`,
      });
    }

    // Optional: Check user permissions (e.g., only NGO can mark as delivered)
    if (status === "delivered" && donation.ngo_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    donation.status = status;
    await donation.save();
    res.status(200).json(donation);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating status", error: error.message });
  }
};

// Delete a donation (Admin or donor)
exports.deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation)
      return res.status(404).json({ message: "Donation not found" });

    // Allow deletion only by Admin or the donor
    if (
      req.user.role !== "admin" &&
      donation.donor.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Donation.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Donation deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting donation", error });
  }
};

exports.editDonation = async (req, res) => {
  try {
    const { item, quantity, unit, expiry_time, pickup_address, status } =
      req.body;
    const donation = await Donation.findById(req.params.id);

    if (!donation)
      return res.status(404).json({ message: "Donation not found" });

    // Allow editing only by the donor
    if (donation.donor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (donation.status !== "available") {
      return res
        .status(400)
        .json({ message: "Only avaialable donations can be edited" });
    }

    // Update fields
    donation.item = item || donation.item;
    donation.quantity = quantity || donation.quantity;
    donation.unit = unit || donation.unit;
    donation.expiry_time = expiry_time || donation.expiry_time;
    donation.pickup_address = pickup_address || donation.pickup_address;

    await donation.save();
    res.status(200).json(donation);
  } catch (error) {
    res.status(500).json({ message: "Error updating donation", error });
  }
};

exports.getTotalDonations = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID not found in token" });
    }

    const total = await Donation.countDocuments({ donor: userId });
    const available = await Donation.countDocuments({
      donor: userId,
      status: "available",
    });
    const claimed = await Donation.countDocuments({
      donor: userId,
      status: "claimed",
    });
    const pending = await Donation.countDocuments({
      donor: userId,
      status: "pending_pickup",
    });
    const delivered = await Donation.countDocuments({
      donor: userId,
      status: "delivered",
    });

    return res.status(200).json({
      total,
      available,
      claimed,
      pending_pickup: pending,
      delivered,
    });
  } catch (error) {
    console.error("Error in getTotalDonations:", error);
    return res.status(500).json({
      message: "Error fetching total donations",
      error: error.message,
    });
  }
};


//get all ngo
exports.getAllNgo = async (req, res) => {
  try {
    const ngos = await User.find({ userType: "ngo" });
    res.status(200).json(ngos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching NGOs", error });
  }
};

exports.getAllRestaurants = async (req , res) =>{
  try{
    const restaurant = await User.find({userType:"restaurant"})
    res.status(200).json(restaurant);
  } catch(error){
      res.status(500).json({message:"Error fetching Restaurants", error})
  }
}