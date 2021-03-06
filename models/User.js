const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    id: {
        type:String,
        maxlength:20
    },
    email: {
        type:String,
        trim:true,
        unique: 1 
    },
    password: {
        type: String,
        minlength: 5
    },
    dateOfBirth:{
        type:String
    },
    address:{
        type:String
    },
    zip:{
        type:String
    },
    role : {
        type:Number,
        default: 0 
    },
    image: [String],
    postureStatusInfo: [String]
})


userSchema.pre('save', function( next ) {
    var user = this;
    
    if(user.isModified('password')){    
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err);
    
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err);
                user.password = hash 
                next()
            })
        })
    } else {
        next()
    }
});

userSchema.methods.comparePassword = function(plainPassword,cb){
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if (err) return cb(err);
        cb(null, isMatch)
    })
}

const User = mongoose.model('User', userSchema);

module.exports = { User }