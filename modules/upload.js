const multer= require("multer")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
      let date= new Date()
      let today= date.getFullYear()+"-"+('0' + (date.getMonth() + 1)).slice(-2)+"-"+('0' + date.getDate()).slice(-2)
      cb(null, `${today}_${file.originalname}`)
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

module.exports= upload