'use strict'

const { CreatedResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
    signUp = async (req, res, next) => {
        console.log("[p]::::", req.body);
        new CreatedResponse({ message: "Shop register successfully", metadata: await AccessService.signUp(req.body) }).send(res);
        // return res.status(201).json(
        //     await AccessService.signUp(req.body)
        // )

    }
}
module.exports = new AccessController();