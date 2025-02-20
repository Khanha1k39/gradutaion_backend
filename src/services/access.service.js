
const { createTokenPair, verifyJWT } = require("../auth/auth.util")
// import { createTokenPair } from "../auth/auth.util"
const KeyStokenService = require("./keyToken.service")

const shopModel = require("../models/shop.model")
const bcrypt = require("bcrypt")
const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",


}
const crypto = require("crypto")
const { BadRequestError, AuthFailureError } = require("../core/error.response")
const { findByEmail } = require("./shop.service")
const { getInfoData } = require("../utils")
class AccessService {
    static signUp = async ({ name, email, password }) => {
        console.log("reqboy", name, email, password)
        const hodelShop = await shopModel.findOne({ email }).lean();
        if (hodelShop) {
            throw new BadRequestError('Shop already register');
        }
        const passwordHash = await bcrypt.hash(password, 10);

        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP]
        })
        if (newShop) {

            const privateKey = crypto.randomBytes(64).toString("hex");
            const publicKey = crypto.randomBytes(64).toString("hex");
            console.log({ privateKey, publicKey })
            // const keyStore = await KeyStokenService.createKey({ userId: newShop._id, publicKey, privateKey })

            // if (!keyStore) {

            //     throw new BadRequestError('Error');
            // }

            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
            console.log("tokens", tokens)
            await KeyStokenService.createKey({ userId: newShop._id, publicKey, privateKey, refreshToken: tokens.refreshToken })

            return {
                data: {
                    shop: newShop,
                    tokens
                }
            }
        }
        return {
            metadata: null
        }


    }
    static login = async ({ name, email, password }) => {
        const foundShop = await findByEmail({ email });
        console.log("foundshop", foundShop)

        if (!foundShop) {
            throw new BadRequestError('Shop is not registered')
        }
        const match = await bcrypt.compare(password, foundShop.password)
        if (!match) {
            throw new AuthFailureError("Password is not match")
        }

        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");
        const tokens = await createTokenPair({ userId: foundShop._id, email }, publicKey, privateKey)
        await KeyStokenService.createKey({ userId: foundShop._id, publicKey, privateKey, refreshToken: tokens.refreshToken })
        return {

            shop: getInfoData({ fields: ['_id', 'email', 'name'], object: foundShop }),
            tokens

        }




    }


    static logout = async ({ keyStore }) => {
        const delKey = await KeyStokenService.removeKeyById(keyStore._id)
        console.log("del key", delKey);
        return delKey;
    }
    static handleRefreshToken = async (refreshToken) => {
        const foundToken = await KeyStokenService.findByRefreshTokenUsed(refreshToken);
        if (foundToken) {
            const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey);
            console.log({ userId, email });
            await KeyStokenService.deleteKeyByUserId(userId);
            throw new BadRequestError("Something went wrong! Please login")

        }
        const holdToken = await KeyStokenService.findByRefreshToken(refreshToken);
        if (!holdToken) {
            throw new AuthFailureError("Shop is not registered")
        }
        const { userId, email } = await verifyJWT(refreshToken, holdToken.privateKey);
        console.log('--2', { userId, email });

        const foundShop = findByEmail({ email })

        if (!foundShop) {
            throw new AuthFailureError("Shop is not registered")
        }
        const tokens = await createTokenPair({ userId: foundShop._id, email }, holdToken.publicKey, holdToken.privateKey)
        await holdToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken,

            },
            $addToSet: {
                refreshTokenUsed: refreshToken,
            }
        })

        return {
            user: { email, userId }, tokens

        }
    }
}

module.exports = AccessService