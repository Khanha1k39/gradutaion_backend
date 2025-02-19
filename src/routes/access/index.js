'use strict'
const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../auth/auth.util");
const router = express.Router()

//signup
router.post('/shop/login', asyncHandler(accessController.login));

router.post('/shop/signup', asyncHandler(accessController.signUp));
module.exports = router;