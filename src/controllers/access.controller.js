'use strict'

const { CreatedResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
    handleRefreshToken = async (req, res, next) => {
        console.log("[p]::::", req.body);
        new CreatedResponse({
            message: "Handle refreshtoken successfully",
            metadata: await AccessService.handleRefreshToken({ refreshToken: req.refreshToken, user: req.user, keyStore: req.keyStore })
        }).send(res);
    }
    login = async (req, res, next) => {
        console.log("[p]::::", req.body);
        new CreatedResponse({ message: "Login successfully", metadata: await AccessService.login(req.body) }).send(res);


    }
    signUp = async (req, res, next) => {
        console.log("[p]::::", req.body);
        new CreatedResponse({ message: "Shop register successfully", metadata: await AccessService.signUp(req.body) }).send(res);


    }
    logout = async (req, res, next) => {
        console.log("[p]::::", req.body);
        new CreatedResponse({ message: "Logout successfully", metadata: await AccessService.logout({ keyStore: req.keyStore }) }).send(res);


    }
}
module.exports = new AccessController();