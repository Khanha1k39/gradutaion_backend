'use strict'
const{StatusCodes,ReasonPhrases} = require("./httpStatusCode")
class ErrorResponse extends Error{
    constructor(message,status){
        super(message);
        this.status = status
    }
}
class ConflictRequestError extends ErrorResponse{
    constructor(message=ReasonPhrases.ConflictRequestError,status=StatusCodes.ConflictRequestError){
        super(message,status)
    }

}

class BadRequestError extends ErrorResponse{
    constructor(message = ReasonPhrases.BadRequestError,status=StatusCodes.BadRequestError){
        super(message,status)
    }
    
}
module.exports={
    BadRequestError,ConflictRequestError
}