"use strict";

const keyTokenModel = require("../models/keyToken.model");

// const keyTokenModel = require("./../models/keyToken");
class KeyStokenService {
  static createKey = async ({ userId, publicKey, privateKey, refreshToken }) => {
    // const publicKeyString = publicKey;
    // const tokens = await keyTokenModel.create({
    //   user: userId,
    //   publicKey,
    //   privateKey,
    // });
    // console.log("tokens",tokens)

    try {
      const filter = { user: userId }, update = {
        publicKey, privateKey, refreshTokenUsed: [], refreshToken
      }, options = { upsert: true, new: true }
      const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error

    }
    // return tokens ? tokens.publicKey : null;
  };
}
module.exports = KeyStokenService;