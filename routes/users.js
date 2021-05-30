const express = require('express');
const router = express.Router();
const { User } = require("../models/User");

//=================================
//             User
//=================================
router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.status(400).json({success:false}).send(err)
        return res.status(200).json({success:true})
    });
});

router.post("/login", (req, res) => {
    User.findOne({id:req.body.id})
        .exec((err,user)=>{
            if(err) return res.status(400).json({success:false,err})
            //해당 아이디를 가진 유저가 없는 경우
            if(!user){
                return res.json({loginSuccess: false, message: '아이디를 잘못 입력하셨습니다'})
            }
            //해당 아이디를 가진 유저가 있는 경우
            //비밀번호 일치 여부
            //일치하지 않는 경우 예외처리
            //일치할 경우 토큰 생성
        })
});

module.exports = router;
