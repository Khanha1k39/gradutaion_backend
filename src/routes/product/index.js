'use strict'
const express = require("express");
const productController = require("../../controllers/product.controller");
const { asyncHandler, authentication } = require("../../auth/auth.util");
const router = express.Router()



router.post('/search/:keySearch', asyncHandler(productController.searchProductsByUser));
router.get('', asyncHandler(productController.findAllProduct));
router.get('/:id', asyncHandler(productController.findProduct));

//authentication
router.use(authentication)
router.post('', asyncHandler(productController.createProduct));
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop));
router.get('/published/all', asyncHandler(productController.getAllPublishedForShop));

router.post('/publish/:id', asyncHandler(productController.PublishProductForShop));
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductForShop));


module.exports = router;