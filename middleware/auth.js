const { User } = require('../models/User');
const jwt= require("../modules/jwt")
const TOKEN_EXPIRED= -3
const TOKEN_INVALID= -2

const auth = {
  checkToken: async (req, res, next) => {
    let token = req.headers.token

    if (!token) return res.status(400).json({success: false, message: 'No Token'})
     
    const decoded = await jwt.verify(token)
    const user= await User.findOne({"_id": decoded.id})
 
    if (decoded === TOKEN_EXPIRED) return res.status(400).json({success: false, message: 'Expired Token'})
    if (decoded === TOKEN_INVALID) return res.status(400).json({success: false, message: 'Invalid Token'})
    if (!user) return res.status(400).json({success: false, message: 'Invalid Token'})
    req.user = user
 
    next()
  }
}

module.exports =  auth ;
