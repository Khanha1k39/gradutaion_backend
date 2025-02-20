'use strict'
const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler, authentication } = require("../../auth/auth.util");
const router = express.Router()

//signup
router.post('/shop/login', asyncHandler(accessController.login));

router.post('/shop/signup', asyncHandler(accessController.signUp));

//authentication
router.use(authentication)
router.post('/shop/logout', asyncHandler(accessController.logout));
router.post('/shop/handleRefreshToken', asyncHandler(accessController.handleRefreshToken));

module.exports = router;