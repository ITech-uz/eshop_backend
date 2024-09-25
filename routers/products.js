const express = require("express");
const Product = require("../models/product");
const Category = require("../models/category")
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer")
const handleValidationError = require("../helpers/validation-error-handler");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jgp": "jgp",
  "image/jpeg": "jpeg"
}


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-")
    const extension = FILE_TYPE_MAP[file.mimetype]
    cb(null, `${fileName}-${Date.now()}.${extension}`)
  }
})

const uploadOption = multer({storage: storage})


// Get all products without token
router.get("/", async (req, res) => {
  const products = await Product.find().populate('category');
  if (!products) {
    res.status(500).json({status: false});
    return;
  }
  res.send(products);
});

router.get("/:id", async (req, res) => {
  const productId = req.params.id
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).send("Invalid product ID");
  }
  const product = await Product.findById(req.params.id).populate('category');
  if (!product) {
    res.status(500).json({status: false, message: "Product not found"});
    return;
  }
  res.send(product);
});

router.post("/", uploadOption.single('image'), async (req, res) => {
  try{
    const categoryId = req.body.category;
    // Check if the categoryId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).send("Invalid category ID");
    }

    const category = await Category.findById(categoryId);
    if (!category) return res.status(400).json({success: false, message: "Category is not valid!"});

    const file = req.file;
    if (!file) return res.status(400).json({success: false, message: "No file in the request!"});

    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`

    let product = Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: `${basePath}${fileName}`,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    });

    product = await product.save()

    if (!product) {
      res.status(500).send("The product cannot be saved")
      return;
    }

    res.send(product)
  } catch (error) {
    if (!handleValidationError(error, res)) {
      res.status(500).json({ success: false, message: 'Server error' });
    }

  }
});

router.put("/:id", async (req, res) => {
  const categoryId = req.body.category;
  // Check if the categoryId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).send("Invalid category ID");
  }
  const category = await Category.findById(categoryId);

  if (!category) return res.status(500).send("Category not found!")

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send("Invalid product ID");
  }

  try{
    const product = await Product.findByIdAndUpdate(req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
      },
      {new: true});

    if (!product) {
      res.status(500).send("The product cannot be saved")
      return;
    }

    res.status(200).json({
      success: true,
      product
    })
  } catch (error) {
    if (!handleValidationError(error, res)) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
})

router.delete("/:id", (req, res) => {
  const id = req.params.id
  Product.findOneAndDelete({_id: id})
    .then(product => {
      if (product)
        return res.status(200).json({success: true, message: "Product deleted successfully!"})
    })
    .catch(err => {
      res.status(400).json({success: false, message: err})
    })
})


router.get("/get/count", async (req, res) => {
  const productsCount = await Product.countDocuments();
  if (!productsCount) {
    res.status(500).json({status: false, message: "Product not found"});
    return;
  }
  res.send({
    count: productsCount
  });
});


router.get("/get/featured/:count", async (req, res) => {
  const count = req.params.count ? req.params.count : 0
  const feturedProducts = await Product.find({isFeatured: true}).limit(+count);
  if (!feturedProducts) {
    res.status(500).json({status: false, message: "Product not found"});
    return;
  }
  res.send(feturedProducts);
});

router.put(
  "/images-gallery/:id",
  uploadOption.array("images"),
  async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid product ID");
    }

    const files = req.files;
    let imagePaths = []
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
    if (files) {
      files.map(image => {
        imagePaths.push(`${basePath}${image.filename}`)
      })
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: imagePaths
      },
      {new: true});

    if (!product) {
      res.status(400).json({success: false, message: "The product cannot be saved"})
      return;
    }

    res.status(200).json({success: true, product})
  }
)


module.exports = router;
