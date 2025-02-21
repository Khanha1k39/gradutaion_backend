"use strict";
const express = require("express");
const CartController = require("../../controllers/cart.controller");
const { asyncHandler, authentication } = require("../../auth/auth.util");
const router = express.Router();

// router.get('/:id', asyncHandler(productController.findProduct));

//authentication
// router.use(authentication);
router.delete("", asyncHandler(CartController.delete));
router.post("/update", asyncHandler(CartController.update));
router.get("", asyncHandler(CartController.listToCart));

router.post("", asyncHandler(CartController.addToCart));

module.exports = router;
