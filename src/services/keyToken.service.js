"use strict";

const keyTokenModel = require("../models/keyToken.model");

// const keyTokenModel = require("./../models/keyToken");
class KeyStokenService {
  static createKey = async ({ userId, publicKey, privateKey }) => {
    // const publicKeyString = publicKey;
    const tokens = await keyTokenModel.create({
      user: userId,
      publicKey,
      privateKey,
    });
    console.log("tokens",tokens)
    return tokens ? tokens.publicKey : null;
  };
}
module.exports = KeyStokenService;