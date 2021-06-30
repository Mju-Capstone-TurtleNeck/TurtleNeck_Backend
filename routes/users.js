const express = require('express');
const multer= require('multer')
const router = express.Router();
const userController= require("../controllers/user")
const auth=require("../middleware/auth").checkToken

//=================================
//             User
//=================================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter:(req,file,cb)=>{
        const ext=path.extname(file.originalname)
        if(ext!=='.png' || ext!=='.jpg'){
            return cb(res.status(400).end('only png or jpg are allowed'),false);
        }
        cb(null,true)
    }
})
const upload = multer({ storage: storage })

router.get("/auth",auth,userController.auth)
router.get("/logout",userController.logout)
router.post("/register", userController.register)
router.post("/id-check",userController.idCheck)
router.post("/login", userController.login)
router.post("/upload-image", auth, upload.single("image"),userController.uploadImage)
router.post("/get-image",auth, userController.getImage)

module.exports = router;
