const userService= require("../services/users")
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
            const user= await userService.findUser(req.body.id)
            if(user) return res.status(400).json({success:false, message:"ID Duplicate"})
            return res.status(200).json({success: true})
        }catch(err){
            console.log(err)
            return res.status(500).json({success:false, err})
        }
    },

    login: async (req, res) => {
        try{
            const user= await userService.findUser(req.body.id)
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
            const user= await userService.findUserAndUpdate(req.body.id,res.req.file.path)
            if(!user) res.status(400).json({success:false, message:"No User"})
            return res.status(200).json({success: true, image: res.req.file.path, fileName: res.req.file.filename})
        }catch(err){
            console.log(err)
            return res.status(500).json({success:false, err})
        }
    }, 

    getImage: async (req, res) => {
        try{
            const user= await userService.findUser(req.body.id)
            if(!user) return res.status(400).json({success: false, message: "No User"})
            return res.status(200).json({success: true, imageURL: user.image})
        }catch(err){
            console.log(err)
            return res.status(500).json({success:false, err})
        }
    }
}

module.exports= user