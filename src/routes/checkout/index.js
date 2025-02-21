"use strict";
const express = require("express");
const CartController = require("../../controllers/cart.controller");
const { asyncHandler, authentication } = require("../../auth/auth.util");
const checkoutController = require("../../controllers/checkout.controller");
const router = express.Router();

// router.get('/:id', asyncHandler(productController.findProduct));

//authentication
// router.use(authentication);
router.post("/review", asyncHandler(checkoutController.checkoutReview));

module.exports = router;
