"use strict";
const JWT = require("jsonwebtoken");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");
const HEADER = {
  CLIENT_ID: 'x-client-id',
  AUTHORAZION: "authorization",
  REFRESHTOKEN: "refreshtoken"


}
const createTokenPair = async (payload, publicKey, privateKey) => {
  console.log("payload", payload)
  try {
    //accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
      // expiresIn: "10s",

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
  //
  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];

      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId) {
        throw new AuthFailureError("Invalid user")
      }
      req.keyStore = keyStore
      req.user = decodeUser;
      req.refreshToken = refreshToken
      return next();

    } catch (error) {
      throw error;
    }
  }

  //
  const accessToken = req.headers[HEADER.AUTHORAZION];
  console.log("keystore ", keyStore)
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      throw new AuthFailureError("Invalid user")
    }
    req.keyStore = keyStore
    req.user = decodeUser;

    return next();

  } catch (error) {
    throw error;
  }
})
const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
}
module.exports = {
  createTokenPair, asyncHandler, authentication, verifyJWT
};