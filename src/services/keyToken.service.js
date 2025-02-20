"use strict";

const { Types } = require("mongoose");
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

  static findByUserId = async (userId) => {
    // return await keyTokenModel.findOne({ user: userId }).lean()

    return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) }).lean()
  }
  static removeKeyById = async (id) => {
    // return await keyTokenModel.findOne({ user: userId }).lean()

    return await keyTokenModel.deleteOne({ _id: new Types.ObjectId(id) })
  }
  static findByRefreshTokenUsed = async (refreshToken) => {

    return await keyTokenModel.findOne({ refreshTokenUsed: refreshToken })
  }
  static findByRefreshToken = async (refreshToken) => {

    return await keyTokenModel.findOne({ refreshToken })
  }
  static deleteKeyByUserId = async (id) => {

    return await keyTokenModel.deleteOne({ user: new Types.ObjectId(id) })
  }
}
module.exports = KeyStokenService;