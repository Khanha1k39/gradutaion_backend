'use strict'
const express = require("express");
const discountController = require("../../controllers/discount.controller");
const { asyncHandler, authentication } = require("../../auth/auth.util");
const router = express.Router()



router.post('/amount', asyncHandler(discountController.getDiscountAmount));
router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodesWithProduct));

// router.get('/:id', asyncHandler(productController.findProduct));

//authentication
router.use(authentication)
router.post('', asyncHandler(discountController.createDiscountCode));
router.get('', asyncHandler(discountController.getAllDiscountCodes));



module.exports = router;