const { User } = require("../models/User");

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
    }
}

module.exports= user