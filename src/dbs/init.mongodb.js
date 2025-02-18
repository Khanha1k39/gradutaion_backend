'use strict'

const { error } = require("console")
const { default: mongoose } = require("mongoose")
const {db:{userName,password}} = require("../configs/config.mongodb")
const connectString =  `mongodb+srv://${userName}:${password}@cluster0.jmoxqb2.mongodb.net/vcc?retryWrites=true&w=majority&appName=Cluster0`;
console.log(connectString)

class Database {
    constructor(){
        this.connect();
    }
    connect(type="mongodb"){
        console.log("connecting")
        mongoose.connect(connectString).then(_=>console.log("connect mongo success"))
        .catch(error=>console.log("error"))
    }
    static getInstance (){
        if(!Database.instance){
            Database.instance = new Database();
        }
        return Database.instance;
    }
}
const instanceMongodb = Database.getInstance();
module.exports=instanceMongodb;