const express = require("express");
const { seedingUser } = require("../controllers/seed.controller");
const seedRouter = express.Router();

seedRouter.get("/users", seedingUser);

module.exports = seedRouter;
