const { login, register } = require("../controllers/auth.js");
const express = require("express");
const router = express.Router();

router.post("/auth/login", login);
router.post("/auth/register", register);

module.exports = router;
