"use strict";

const express = require("express");
const uploadController = require("../../controllers/upload.controller");
const router = express.Router();
// const { asyncHandler } = require("../../auth/checkAuth");
// const { authenticationV2 } = require("../../auth/authUtils");
const { uploadDisk, uploadMemory } = require("../../configs/multer.config");
const { asyncHandler, authentication } = require("../../auth/auth.util");

router.use(authentication);

// router.post("/product", asyncHandler(uploadController.uploadFile));

// router.post(
//   "/product/thumb",
//   uploadDisk.single("file"),
//   asyncHandler(uploadController.uploadFileThumb)
// );

// router.post(
//   "/product/multiple",
//   uploadDisk.array("files", 3),
//   asyncHandler(uploadController.uploadImageFromLocalFiles)
// );
router.post(
  "/product",
  uploadMemory.single("file"),
  asyncHandler(uploadController.uploadImageFromLocalS3)
);

module.exports = router;
