const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  const users = await User.find();
  if (!users) {
    res.status(400).send("Users cannot find")
  }
  res.send(users)

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

// Auth
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.SECRET;

  if (!user) {
    return res.status(400).send("User not found");
  }

  // Use bcrypt.compare for password comparison
  const isMatch = await bcrypt.compare(req.body.password, user.passwordHash);
  if (isMatch) {
    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin },
      secret,
      { expiresIn: '1d' }
    );
    return res.status(200).send({ user: user.email, token });
  }
  res.status(400).send("Password is wrong!");
});

router.post("/register", async (req, res) => {
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
