'use strict'
const express = require("express");
const productController = require("../../controllers/product.controller");
const { asyncHandler, authentication } = require("../../auth/auth.util");
const router = express.Router()


//authentication
router.use(authentication)
router.post('', asyncHandler(productController.createProduct));

module.exports = router;