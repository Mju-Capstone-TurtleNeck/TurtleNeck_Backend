const express = require('express');
const router = express.Router();
const userController= require("../controllers/user")
const auth=require("../middleware/auth").checkToken
const upload= require("../modules/upload")

//=================================
//             User
//=================================

router.get("/auth",auth,userController.auth)
router.get("/logout", userController.logout)
router.post("/register", userController.register)
router.post("/id-check",userController.idCheck)
router.post("/login", userController.login)
router.post("/upload-image", auth, upload.single("image"),userController.uploadImage)
router.post("/get-image",auth, userController.getImage)
router.post("/find-id", userController.findID)

module.exports = router;
