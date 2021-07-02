const nodemailer= require("nodemailer")
const mailInfo= require("../config/mail")

const mail={
    transport: async ()=>{
        let transporter= nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: mailInfo.mail,
                pass: mailInfo.pass
            }
        })
        return transporter
    },

    send: async (toMail, id, transporter)=>{
        let info= transporter.sendMail({
            from: `"Dr.G Team" <${mailInfo.mail}>`,
            to: toMail,
            subject: "Dr.G Team: 회원님의 아이디를 알려드립니다",
            html: `<h3>회원님의 아이디는 다음과 같습니다</h3>
                   <p>${id}</p>`
        })
        return info
    }
}

module.exports= mail