"use strict";
const JWT = require("jsonwebtoken");
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
const asyncHandler = fn =>{
  return (req,res,next)=>{
    fn(req,res,next).catch(next)
  }
}
module.exports = {
  createTokenPair,asyncHandler
};