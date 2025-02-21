"use strict";
const express = require("express");
const router = express.Router();
// router.()
//access

router.use("/v1/api/discount", require("./discount/index"));
router.use("/v1/api/product", require("./product/index"));
router.use("/v1/api/cart", require("./cart/index"));

router.use("/v1/api", require("./access/index"));

module.exports = router;
