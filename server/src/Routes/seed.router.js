const express = require("express");
const {
  seedingUser,
  seedingProducts,
} = require("../controllers/seed.controller");
const upload = require("../middlewares/uploadFile");
const seedRouter = express.Router();

seedRouter.get("/users", seedingUser);
seedRouter.get("/products", upload.single("image"), seedingProducts);

module.exports = seedRouter;
