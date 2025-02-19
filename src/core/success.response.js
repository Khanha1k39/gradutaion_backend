'use strict'

const { ReasonPhrases } = require("./httpStatusCode");
const reasonPhrases = require("./reasonPhrases");
const statusCodes = require("./statusCodes");

class SuccessResonse {
    constructor({message,statusCode,metadata,reasonStatusCode =reasonPhrases.OK }){
        this.message=!message ? reasonStatusCode: message;
        this.status=statusCode;
        this.metadata=metadata;
    }
    send(res,headers={}){
        return res.status(this.status).json(
            this
        )
    }
}
class OkResponse extends SuccessResonse{
    constructor({message,metadata}){
        super({message,metadata,statusCode:statusCodes.OK})
    }
}
class CreatedResponse extends SuccessResonse{
    constructor({message,metadata}){
        super({message,metadata,statusCode:statusCodes.CREATED,reasonStatusCode:ReasonPhrases.CREATED})
    }
}
module.exports={CreatedResponse,OkResponse
}