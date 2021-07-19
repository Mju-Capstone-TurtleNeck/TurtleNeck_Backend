const { User } = require("../models/User");
const jwt= require("jsonwebtoken")
const config= require("../config/tokenKey")

const user={
    findUserByID: async (userId)=>{
        const user= User.findOne({id: userId})
        return user
    },

    findUserAndUpdate: async (decoded, filePath, postureStatusInfo)=>{
        const user= User.findOneAndUpdate({_id: decoded},{$push: {image: filePath, postureStatusInfo: postureStatusInfo}})
        return user
    },

    registerUser: async (userContent)=>{
        const user= new User(userContent)
        const saveResult= user.save()
        return saveResult
    },

    findUserByEmail: async (userEmail)=>{
        const user= User.findOne({email: userEmail})
        return user
    },

    findUserByEmailAndID: async (userID, userEmail)=>{
        const user= User.findOne({email: userEmail, id: userID})
        return user
    },

    findUserByDecoded: async(decoded)=>{
        console.log(decoded)
        const user= User.findOne({_id: decoded})
        return user
    },

    resetPassword: async (userPass, user)=>{
        user.password= userPass
        const saveResult= user.save()
        return saveResult
    }
}

module.exports= user