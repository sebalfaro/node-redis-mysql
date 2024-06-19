const { Router } = require("express");
const { getIndex } = require("../controllers/index/index.controller");
const router = Router();

// Routes
router.get("/ping", getIndex);

module.exports = { router };
