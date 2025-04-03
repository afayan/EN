import express from "express";
import User from "../dbs/users.js"; 
import bcrypt from "bcrypt";

const router = express.Router();

// Fetch user details by email
router.get("/get-user", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ status: false, message: "Email is required" });
    }

    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    res.status(200).json({ status: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server error" });
  }
});

// Change Password Route
router.post("/change-password", async (req, res) => {
  try {
    console.log("Received password change request:", req.body);

    const { email, oldPassword, newPassword } = req.body;
    if (!email || !oldPassword || !newPassword) {
      console.log("Missing fields");
      return res.status(400).json({ status: false, message: "All fields are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ status: false, message: "User not found." });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      console.log("Old password is incorrect");
      return res.status(400).json({ status: false, message: "Old password is incorrect." });
    }

    console.log("Password is correct, updating...");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await User.updateOne({ email }, { $set: { password: hashedPassword } });

    console.log("Password updated successfully!");
    res.status(200).json({ status: true, message: "Password updated successfully!" });
  } catch (error) {
    console.error("Error in /change-password:", error);
    res.status(500).json({ status: false, message: "Server error." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ status: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: false, message: "Invalid credentials" });
    }

    res.status(200).json({ status: true, message: "Login successful", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server error" });
  }
});

export default router;
