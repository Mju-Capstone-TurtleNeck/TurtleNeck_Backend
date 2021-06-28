const { User } = require("../models/User");
const jwt= require("jsonwebtoken")
const config= require("../config/tokenKey")

const user={
    findUser: async (userId)=>{
        const user= User.findOne({id: userId})
        return user
    },

    registerUser: async (userContent)=>{
        const user= new User(userContent)
        const saveResult= user.save()
        return saveResult
    },

    logout: async (userId)=>{
        const result= User.findOneAndUpdate({ _id: userId }, { token: "", tokenExp: "" })
        return result
    },

    generateToken: async (user)=>{
        let token= jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        })

        return token
    }
}

module.exports= user