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

    sendID: async (toMail, id, transporter)=>{
        let secretID= id.replace(id.substr(-4),'****')
        let info= transporter.sendMail({
            from: `"Dr.G Team" <${mailInfo.mail}>`,
            to: toMail,
            subject: "Dr.G Team: 회원님의 아이디를 알려드립니다",
            html: `<h3>회원님의 아이디는 다음과 같습니다</h3>
                   <p>${secretID}</p>`
        })
        return info
    },

    sendCertificationNum: async (toMail, transporter, certifNum)=>{
        let info= transporter.sendMail({
            from: `"Dr.G Team" <${mailInfo.mail}>`,
            to: toMail,
            subject: "Dr.G Team: 회원님이 요청하신 인증번호를 알려드립니다",
            html: `<h3>인증번호는 다음과 같습니다</h3>
                   <p>${certifNum}</p>`
        })
        return info
    }
}

module.exports= mail