"use strict";
const express = require("express");
const { asyncHandler, authentication } = require("../../auth/auth.util");
const commentController = require("../../controllers/comment.controller");
const router = express.Router();

// router.get('/:id', asyncHandler(productController.findProduct));

//authentication
// router.use(authentication);
router.post("/", asyncHandler(commentController.createComment));

module.exports = router;
