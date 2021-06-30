const { User } = require("../models/User");
const jwt= require("jsonwebtoken")
const config= require("../config/tokenKey")

const user={
    findUser: async (userId)=>{
        const user= User.findOne({id: userId})
        return user
    },

    findUserAndUpdate: async (userId, filePath)=>{
        const user= User.findOneAndUpdate({id: userId},{image: filePath})
        return user
    },

    registerUser: async (userContent)=>{
        const user= new User(userContent)
        const saveResult= user.save()
        return saveResult
    }
}

module.exports= user