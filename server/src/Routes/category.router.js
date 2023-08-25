const express = require("express");
const categoryRouter = express.Router();
const {
  handelCategoryCreate,
  handelGetCategories,
  handelGetCategory,
  handelUpdateCategory,
  handelDeleteCategory,
} = require("../controllers/category.controller");
const { validateCategory } = require("../validators/category");
const runValidation = require("../validators");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");

categoryRouter.post(
  "/",
  validateCategory,
  runValidation,
  isLoggedIn,
  isAdmin,
  handelCategoryCreate
);
categoryRouter.get("/", handelGetCategories);
categoryRouter.get("/:slug", handelGetCategory);
categoryRouter.put(
  "/:slug",
  validateCategory,
  runValidation,
  isLoggedIn,
  isAdmin,
  handelUpdateCategory
);
categoryRouter.delete("/:slug", isLoggedIn, isAdmin, handelDeleteCategory);

module.exports = categoryRouter;
