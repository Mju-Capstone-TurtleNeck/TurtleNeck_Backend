const userService= require("../services/users")

const user={
    auth: (req,res)=>{
        res.status(200).json({
            id:req.user.id,
            isAdmin:req.user.role===0?false:true,
            isAuth:true,
            email: req.user.email,
            dateOfBirth:req.user.dateOfBirth,
            address:req.user.address,
            role: req.user.role,
            image: req.user.image
        })
    },

    register: async (req, res) => {
        try{
            const user= await userService.findUser(req.body.id)
            if(user) return res.status(400).json({success:false, message:"Try Another Id"})
    
            const saveUserResult= await userService.registerUser(req.body)
            return res.status(200).json({success:true, user:saveUserResult})
        }catch(err){
            console.log(err)
        }
    },

    login: async (req, res) => {
        try{
            const user= await userService.findUser(req.body.id)
            if(!user) return res.status(400).json({loginSuccess: false,message: "Auth failed, ID is not found"})
    
            user.comparePassword(req.body.password, async (err,isMatch)=>{
                //일치하지 않는 경우 예외처리
                if(!isMatch) return res.status(400).json({loginSuccess:false, message: '비밀번호를 잘못 입력하셨습니다'})
                //일치할 경우 토큰 생성
                let token = await userService.generateToken(user)
                res.status(200).json({loginSuccess:true, userId:user._id, token: token})
            })
        }catch(err){
            console.log(err)
        }
    },

    logout: async (req,res)=>{
        try{
            const result= await userService.logout(req.user._id)
            return res.status(200).json({success: true});
        }catch(err){
            console.log(err)
        }   
    },

    uploadImage: async (req, res) => {
        try{
            const user= await userService.findUser(req.body.id)
            user.image= res.req.file.filename
            return res.status(200).json({success: true, image: res.req.file.path, fileName: res.req.file.filename})
        }catch(err){
            console.log(err)
        }
    },

    getImage: async (req, res) => {
        try{
            const user= await userService.findUser(req.body.id)
            if(!user) return res.status(400).json({success: false, message: "That user is not exist"})
            return res.status(200).json({success: true, imageURL: user.image})
        }catch(err){
            console.log(err)
        }
    }
}

module.exports= user