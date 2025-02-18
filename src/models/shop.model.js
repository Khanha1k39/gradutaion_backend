'use strict'
const mongoose = require('mongoose'); // Erase if already required
const {model,Type,Schema}= require("mongoose");
const DOCUMENT_NAME='Shop'
const COLLECTION_NAME='Shops'

// Declare the Schema of the Mongo model
var shopSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        maxLength:150 

    },
    email:{
        type:String,
        unique:true,
        trim:true,
    },
    status:{
        type:String,
        enum:['active','inactive'],
        default:'inactive',
    },
    verify:{
        type:Schema.Types.Boolean,
        default:false,
    }},{
        timestamps:true,
        collection:COLLECTION_NAME
    }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, shopSchema);