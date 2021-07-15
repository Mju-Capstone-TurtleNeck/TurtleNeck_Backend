const { User } = require("../models/User");
const jwt= require("jsonwebtoken")
const config= require("../config/tokenKey")

const user={
    findUserByID: async (userId)=>{
        const user= User.findOne({id: userId})
        return user
    },

    findUserAndUpdate: async (userID, filePath)=>{
        const user= User.findOneAndUpdate({id: userID},{$push: {image: filePath}})
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

    resetPassword: async (userPass, user)=>{
        user.password= userPass
        const saveResult= user.save()
        return saveResult
    }
}

module.exports= user