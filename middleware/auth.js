const { User } = require('../models/User');

let auth = (req, res, next) => {
  //쿠키에서 토큰 정보를 가져옴
  let token = req.cookies.w_auth;

  User.findByToken(token, (err, user) => {
    if (err) throw err;
    //해당 토큰을 가진 유저가 존재하지 않으면, 인증 실패
    if (!user)
      return res.json({isAuth: false, err:true, message:'인증 실패'});
    
    //인증성공
    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = { auth };
