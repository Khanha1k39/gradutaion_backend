
const { createTokenPair } = require( "../auth/auth.util")
// import { createTokenPair } from "../auth/auth.util"
const KeyStokenService = require( "./keyToken.service")

const shopModel = require("../models/shop.model")
const bcrypt = require("bcrypt")
 const RoleShop={SHOP:"SHOP",
    WRITER:"WRITER",


 }
 const crypto = require("crypto")
 class AccessService{
    static signUp = async ({name,email,password})=>{
        try {
            console.log("reqboy",name,email,password)
            const hodelShop =await shopModel.findOne({email}).lean();
            if(hodelShop){
                return {
                    code:"xxxx",
                    message:'Shop already register'
                }
            }
            const passwordHash = await bcrypt.hash(password,10);

            const newShop=await shopModel.create({
                name,email,password:passwordHash,roles:[RoleShop.SHOP]
            })
            if(newShop){
                //created key and public keyc
        // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        //   modulusLength: 4096,
        //   publicKeyEncoding: {
        //     type: "pkcs1",
        //     format: "pem",
        //   },
        //   privateKeyEncoding: {
        //     type: "pkcs1",
        //     format: "pem",
        //   },
        // });
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");
                console.log({privateKey,publicKey})
             const   keyStore = await KeyStokenService.createKey({userId:newShop._id,publicKey,privateKey})

                if(!keyStore){

                     return {message:"error when public key"}
                }
                const tokens = await createTokenPair({userId:newShop._id,email},publicKey,privateKey)
                console.log("tokens",tokens)
                return {
                    code:201,
                    metadata:{
                        shop:newShop,
                        tokens
                    }
                }
            }
            return {
                code:201,metadata:null
            }
            
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = AccessService