"use strict";
const express = require("express");
const inventoryController = require("../../controllers/inventory.controller");
const { asyncHandler, authentication } = require("../../auth/auth.util");
const router = express.Router();

// router.post("/amount", asyncHandler(discountController.getDiscountAmount));
// router.get(
//   "/list_product_code",
//   asyncHandler(discountController.getAllDiscountCodesWithProduct)
// );

// router.get('/:id', asyncHandler(productController.findProduct));

//authentication
router.use(authentication);
router.post("", asyncHandler(inventoryController.createDiscountCode));

module.exports = router;
