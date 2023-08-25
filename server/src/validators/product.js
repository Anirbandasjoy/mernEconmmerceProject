const { body } = require("express-validator");

const validateProduct = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product Name is required")
    .isLength({ min: 3, max: 150 })
    .withMessage("Product Name should be at least 3-150 charactors long"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Procuct description is required")
    .isLength({ min: 3 })
    .withMessage("Product description should be at least 3 charactors long"),
  body("price")
    .trim()
    .notEmpty()
    .withMessage("Product Price is required")
    .isFloat({ min: 0 })
    .withMessage("Product Price must be possitibe number "),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Product category is required"),
  body("quantity")
    .trim()
    .notEmpty()
    .withMessage("Product Quantity is required")
    .isFloat({ min: 0 })
    .withMessage("Product quantity  must be a postibe number"),
];

module.exports = {
  validateProduct,
};
