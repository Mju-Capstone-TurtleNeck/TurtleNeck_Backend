const userService= require("../services/users")
const nodemailer= require("../modules/nodemailer")
const jwt= require("../modules/jwt")

const user={
    auth: (req,res)=>{
        res.status(200).json({
            rol: req.user.role,
            id: req.user.id,
            email: req.user.email,
            _id: req.user._id,
            isAuth:true
        })
    },

    register: async (req, res) => {
        try{
            const saveUserResult= await userService.registerUser(req.body)
            return res.status(200).json({success:true, user:saveUserResult})
        }catch(err){
            if(err.code==11000){
                return res.status(400).json({success:false, message:"Mail Duplicate"})
            }else{
                return res.status(500).json({success:false, err})
            }
        }
    },

    idCheck: async (req,res)=>{
        try{
            const user= await userService.findUserByID(req.body.id)
            if(user) return res.status(400).json({success:false, message:"ID Duplicate"})
            return res.status(200).json({success: true})
        }catch(err){
            console.log(err)
            return res.status(500).json({success:false, err})
        }
    },

    login: async (req, res) => {
        try{
            const user= await userService.findUserByID(req.body.id)
            if(!user) return res.status(400).json({success: false,message: "Wrong ID"})
    
            user.comparePassword(req.body.password, async(err,isMatch)=>{
                //일치하지 않는 경우 예외처리
                if(!isMatch) return res.status(400).json({success:false, message: 'Wrong Password'})
                //일치할 경우 토큰 생성
                const token = await jwt.sign(user)
                res.status(200).json({success: true, token: token.token})
            })
        }catch(err){
            console.log(err)
            return res.status(500).json({success:false, err})
        }
    },

    logout: async (req,res)=>{
        try{
            return res.status(200).json({success: true, isAuth: false});
        }catch(err){
            console.log(err)
            return res.status(500).json({success:false, err})
        }   
    },

    uploadImage: async (req, res) => {
        try{
            const decoded= await jwt.verify(req.headers.token)
            const user= await userService.findUserAndUpdate(decoded.id,res.req.file.path, req.body.postureStatusInfo)
            if(!user) res.status(400).json({success:false, message:"No User"})
            return res.status(200).json({success: true, image: res.req.file.path, fileName: res.req.file.filename, postureStatusInfo: req.body.postureStatusInfo})
        }catch(err){
            console.log(err)
            return res.status(500).json({success:false, err})
        }
    }, 

    getImage: async (req, res) => {
        try{
            const decoded= await jwt.verify(req.headers.token)
            const user= await userService.findUserByDecoded(decoded.id)
            if(!user) return res.status(400).json({success: false, message: "No User"})
            return res.status(200).json({success: true, imageURL: user.image, postureStatusInfo: user.postureStatusInfo})
        }catch(err){
            console.log(err)
            return res.status(500).json({success:false, err})
        }
    },

    findID: async (req,res)=>{
        try{
            const user= await userService.findUserByEmail(req.body.email)
            if(!user) return res.status(400).json({success: false, message: "No User"})

            const transporter= await nodemailer.transport()
            const info= await nodemailer.sendID(user.email, user.id, transporter)
            return res.status(200).json({success: true, message: "Send message to user"})
        }catch(err){
            return res.status(500).json({success:false, err})
        }
    },

    sendAuthNumber: async (req,res)=>{
        try{
            const user= await userService.findUserByEmailAndID(req.body.id, req.body.email)
            if(!user) return res.status(400).json({success: false, message: "No User"})
      
            const ranNum = Math.floor(Math.random()*(999999-111111+1)) + 111111
            const transporter= await nodemailer.transport()
            const info= await nodemailer.sendCertificationNum(user.email, transporter, ranNum)
            return res.status(200).json({success: true, AuthNumber: ranNum})
        }catch(err){
            return res.status(500).json({success:false, err})
        }
    },

    resetPass: async (req,res)=>{
        try{
            const user= await userService.findUserByID(req.body.id)
            if(!user) return res.status(400).json({success: false, message: "No User"})

            const saveResult= await userService.resetPassword(req.body.password, user)
            return res.status(200).json({success: true, message: "Password reset"})
        }catch(err){
            return res.status(500).json({success:false, err})
        }
    }
}

module.exports= user