"use strict";
const JWT = require("jsonwebtoken");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");
const HEADER = {
  CLIENT_ID: 'x-client-id',
  AUTHORAZION: "authorization"
}
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    //accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    //refreshToken
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });
    JWT.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        console.log("verify error");
      } else {
        console.log("decode verify ::: ", decoded);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error)
  }
};
const asyncHandler = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}
const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("invalid request")
  const keyStore = await findByUserId(userId)
  if (!keyStore) {
    throw new NotFoundError("Not found keyStore")
  }
  const accessToken = req.headers[HEADER.AUTHORAZION];
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      throw new AuthFailureError("Invalid user")
    }
    req.keyStore = keyStore
    return next();

  } catch (error) {
    throw error;
  }
})
module.exports = {
  createTokenPair, asyncHandler, authentication
};