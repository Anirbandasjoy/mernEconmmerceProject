const express = require("express");
const productRouter = express.Router();
const upload = require("../middlewares/uploadFile");
const {
  handelProductCreate,
  handelGetProducts,
  handelGetProduct,
  handelDeleteProduct,
  handelUpdateProduct,
} = require("../controllers/product.controller");
const { validateProduct } = require("../validators/product");
const runValidation = require("../validators");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");

productRouter.post(
  "/",
  upload.single("image"),
  validateProduct,
  runValidation,
  isLoggedIn,
  isAdmin,
  handelProductCreate
);
productRouter.get("/", handelGetProducts);
productRouter.get("/:slug", handelGetProduct);
productRouter.delete("/:slug", handelDeleteProduct);
productRouter.put(
  "/:slug",
  upload.single("image"),
  isLoggedIn,
  isAdmin,
  handelUpdateProduct
);

module.exports = productRouter;
