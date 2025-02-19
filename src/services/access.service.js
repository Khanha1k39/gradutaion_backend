
const { createTokenPair } = require("../auth/auth.util")
// import { createTokenPair } from "../auth/auth.util"
const KeyStokenService = require("./keyToken.service")

const shopModel = require("../models/shop.model")
const bcrypt = require("bcrypt")
const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",


}
const crypto = require("crypto")
const { BadRequestError } = require("../core/error.response")
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
            const keyStore = await KeyStokenService.createKey({ userId: newShop._id, publicKey, privateKey })

            if (!keyStore) {

                throw new BadRequestError('Error');
            }
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
            console.log("tokens", tokens)
            return {
                code: 201,
                data: {
                    shop: newShop,
                    tokens
                }
            }
        }
        return {
            code: 201, metadata: null
        }


    }
}

module.exports = AccessService