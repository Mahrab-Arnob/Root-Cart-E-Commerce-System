import Address from "../models/address.model.js";
import User from "../models/user.model.js";

export const addAddress = async (req, res) => {
  try {
    console.log("📦 Address creation started");
    
    const { name, email, city, country, zipCode, state, street, phone } = req.body;
    
    // Safety check for user
    if (!req.user || !req.user._id) {
       return res.status(401).json({ success: false, message: "User not authenticated" });
    }
    
    const userId = req.user._id;

    const newAddress = await Address.create({
      user: userId, // ✅ Link to the user
      name,
      email,
      city,
      country,
      zipCode,
      state,
      phone: phone || "", // Handle optional fields
    });
    
    // Optional: If you want to link address back to user model
    await User.findByIdAndUpdate(userId, {
      $push: { addresses: newAddress._id },
    });
    
    res.status(201).json({ success: true, message: "Address added successfully", address: newAddress });
  } catch (error) {
    console.error("❌ Address creation error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserAddresses = async (req, res) => {
  try {
    // Safety check
    if (!req.user || !req.user._id) {
       return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const addresses = await Address.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, addresses });
  } catch (error) {
    console.error("❌ Get addresses error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    await Address.findByIdAndDelete(id);
    res.json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};