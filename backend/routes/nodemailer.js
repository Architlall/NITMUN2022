const router = require("express").Router();
const registrations = require("../models/Registrations");
const nodemailer = require("nodemailer");
const {google} = require("googleapis")

const CLIENT_ID = '457703136236-96a3rrf7kie1fksvvc84jm5chh1qu29c.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04DXifeto2BDLCgYIARAAGAQSNwF-L9IrvcuQVa5CTx-3qPWX1s0Q-1bYQIDmyBocqWuo8rnoxaUNljoUu2toSYM5niCURlP_uFY'

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

// mailer

router.post("/mail", async (req,res)=>{
    try{
        const participants = await registrations.find()
        let mailList = [];
        participants.map(participant=>{
        mailList.push(participant.email)
        })
        let accessToken = await oAuth2Client.getAccessToken()
        let transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            type: 'OAuth2',
            user: 'subrolinaghosh@gmail.com',
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken
            },
            tls:{
                rejectUnauthorized:false
            }
          });
        let info = await transport.sendMail({
            from: '"Mouli" <subrolinaghosh@gmail.com>', 
            to: mailList, // list of receivers
            subject: "Hello ", 
            text: "Hello participants", 
            html: "<b>welcome to nitmun x</b>", 
          });
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        res.status(200).json("mail sent")
    } catch(err){
        res.status(500).json(err);
    }
});

module.exports = router