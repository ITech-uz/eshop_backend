const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcryptjs");

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.send(users)
  } catch (error) {
    res.status(400).json({ success: false, message: "Something went wrong", error })
  }
})

router.get("/:id", async (req, res) => {
  const id = req.params.id
  try {
    const user = await User.findById(id).select("-passwordHash")
    res.send(user)
  } catch (error) {
    res.status(400).json({ success: false, message: "Something went wrong", error })
  }
})

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
  })
  user = await user.save()
  if (!user) {
    return res.status(400).send("The category is not created")
  }
  res.send(user).json({ success: true })
})


module.exports = router;
