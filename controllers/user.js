const { User } = require("../models/User");

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

    register: (req, res) => {
        User.findOne({id:req.body.id})
            .exec((err,result)=>{
                if(err) return res.status(400).json({success: false, err})
                else if(result) return res.status(400).json({success:false, message:"Try Another Id"})
                
                const user = new User(req.body);
                user.save((err, doc) => {
                    if (err) return res.status(400).json({success:false,err})
                    return res.status(200).json({success:true})
                });
            })
    },

    login: (req, res) => {
        User.findOne({id:req.body.id})
            .exec((err,user)=>{
                if(err) return res.status(400).json({success:false,err})
                //해당 아이디를 가진 유저가 없는 경우
                if(!user){
                    return res.json({loginSuccess: false, message: '아이디를 잘못 입력하셨습니다'})
                }
                //해당 아이디를 가진 유저가 있는 경우
                //비밀번호 일치 여부
                user.comparePassword(req.body.password,(err,isMatch)=>{
                    //일치하지 않는 경우 예외처리
                    if(!isMatch) return res.json({loginSuccess:false, message: '비밀번호를 잘못 입력하셨습니다'})
                    //일치할 경우 토큰 생성
                    user.generateToken((err,user)=>{
                        if(err) return res.status(400).json({success:false,err})
                        res.cookie('w_authExp',user.tokenExp)
                            .cookie('w_auth',user.token)
                            .status(200)
                            .json({loginSuccess:true, userId:user._id})
                    })
                })      
            })
    },

    logout: (req,res)=>{
        User.findOneAndUpdate({id:req.user.id},{token:"", tokenExp:""})
            .exec((err,doc)=>{
                if(err) return res.status(400).json({success: false, err})
                return res.status(200).json({success:true})
            })      
    },

    uploadImage:  (req, res) => {
        User.findOne({"_id":req.body.userId})
            .exec((err,user)=>{
                if(err) return res.status(400).json({success: false, err})
                user.image= res.req.file.filename
                return res.status(200).json({
                    success: true,
                    image: res.req.file.path,
                    fileName: res.req.file.filename
                })
            })
    },

    getImage: (req, res) => {
        User.findOne({"id":req.body.id})
            .exec((err,user)=>{
                if(err) return res.status(400).json({success:false, err})
                else if(!user) return res.status(400).json({success:false, message:"That user is not exist"})
                return res.status(200).json({success:true, imageURL:user.image})
            })
    }
}

module.exports= user