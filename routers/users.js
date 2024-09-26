const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const handleValidationError = require("../helpers/validation-error-handler")

// Get all users Only Admins
router.get("/", async (req, res) => {
  const users = await User.find();
  if (!users) {
    res.status(400).json({success: false, message: "Users cannot find"});
  }
  res.status(200).json({success: true, users});
});

// Get user's data
router.get("/getme", async (req, res) => {
  if (req.headers && req.headers.authorization) {
    const authorization = req.headers.authorization.split(" ")[1];
    let decoded;

    try {
      decoded = jwt.verify(authorization, process.env.SECRET);
      const userId = decoded.userId;
      console.log("Decoded userId:", userId);

      // Fetch the user by id
      const user = await User.findById(userId).select("-passwordHash");

      if (!user) {
        // Handle the case where the user is not found
        return res.status(404).json({success: false, message: "User not found"});
      }

      return res.status(200).json({success: true, user});
    } catch (e) {
      return res.status(401).send("Unauthorized");
    }
  } else {
    // If the authorization header is missing
    return res.status(400).send("Authorization header is missing");
  }
});

// Create user for admins
router.post("/", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  user = await user.save();
  if (!user) {
    return res.status(400).json({success: false, message: "Something went wrong, try again later!"});
  }
  res.status(200).json({success: true, user});
});

// Auth
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({email: req.body.email});
    const secret = process.env.SECRET;

    if (!user) {
      return res.status(400).send("User not found");
    }

    // Use bcrypt.compare for password comparison
    const isMatch = await bcrypt.compare(req.body.password, user.passwordHash);
    if (isMatch) {
      const token = jwt.sign({userId: user.id, isAdmin: user.isAdmin}, secret, {
        expiresIn: "1d",
      });

      const userWithoutPassword = user.toObject({versionKey: false});
      delete userWithoutPassword.passwordHash;

      return res.status(200).json({
        success: true,
        user: userWithoutPassword,
        token
      });
    }
    res.status(400).json({success: false, message: "Password is wrong!"});
  } catch (error) {
    if (!handleValidationError(error, res)) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
});

// Register user for public users
router.post("/register", async (req, res) => {
  try {
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    });
    user = await user.save();
    if (!user) {
      return res.status(400).json({success: false, message: "User cannot be saved!"});
    }
    res.status(200).json({success: true, message: "Successfully registered!"});
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Handle Mongoose validation errors
      return res.status(422).json({
        success: false,
        message: 'Validation error',
        errors: Object.keys(error.errors).map((key) => ({
          field: key,
          message: error.errors[key].message,
        })),
      });
    }

    // For other errors, you can send a general error response
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get specific user with user id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id).select("-passwordHash");
    res.status(200).json({success: true, user});
  } catch (error) {
    res
      .status(400)
      .json({success: false, message: "Something went wrong", error});
  }
});

module.exports = router;
