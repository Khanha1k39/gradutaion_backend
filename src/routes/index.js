'use strict'
const express = require("express");
const router = express.Router()
// router.()
//access

router.use("/v1/api", require("./access/index"))
router.use("/v1/api/product", require("./product/index"))

module.exports = router