"use strict";
const express = require("express");
const inventoryController = require("../../controllers/inventory.controller");
const { asyncHandler, authentication } = require("../../auth/auth.util");
const notificationController = require("../../controllers/notification.controller");
const router = express.Router();

//authentication
router.use(authentication);
router.get("", asyncHandler(notificationController.listNotiByUser));

module.exports = router;
