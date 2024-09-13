const express = require("express");
const Category = require("../models/category");
const category = require("../models/category");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find()
    res.send(categories)
  } catch (error) {
    res.status(400).json({ success: false, message: "Something went wrong", error })
  }
})

router.get("/:id", async (req, res) => {
  const id = req.params.id
  try {
    const categories = await Category.findById(id)
    res.send(categories)
  } catch (error) {
    res.status(400).json({ success: false, message: "Something went wrong", error })
  }
})

router.post("/", async (req, res) => {
  const { name, color, icon } = req.body
  let storedCategory = new Category({
    name,
    color,
    icon
  })
  storedCategory = await storedCategory.save()

  if (!storedCategory) {
    return res.status(400).send("The category is not created")
  }

  res.send(storedCategory).json({ success: true })
})

router.put("/:id", async (req, res) => {
  const { name, color, icon } = req.body
  Category.findByIdAndUpdate(req.params.id, { name, color, icon }, { new: true })
    .then(updatedCategory => {
      if (updatedCategory) {
        return res.status(200).send(updatedCategory)
      }
    })
    .catch(err => {
      res.status(400).json({ success: false, message: err })
    })
})

router.delete("/:id", (req, res) => {
  const id = req.params.id
  Category.findOneAndDelete({ _id: id })
    .then(category => {
      if (category)
        return res.status(200).json({ success: true, message: "Category deleted successfully!" })
    })
    .catch(err => {
      res.status(400).json({ success: false, message: err })
    })
})

module.exports = router;
