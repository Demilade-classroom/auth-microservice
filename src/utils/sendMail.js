const nodemailer = require('nodemailer')
const config = require('../config');

exports.sendMail = (from, to, subject, msg) => {
    return new Promise((resolve, reject) => {
        const smtpTransport = nodemailer.createTransport({
            host: config.MAIL_HOST,
            port: config.MAIL_PORT,
            secure: false,
            auth: {
                user: config.MAIL_USERNAME, 
                pass: config.MAIL_PASSWORD, 
            }
        });
  
        smtpTransport.verify(function(error, success) {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log("Server is ready to take our messages");
            }
        });
  
        const mailOptions = {
            from: from,
            to: to,
            subject: subject,
            text: msg,
            html: msg
        };
  
        smtpTransport.sendMail(mailOptions, (err) => {
            if(err){
                reject(err);
            }
            resolve(true);
        });
    })
};
