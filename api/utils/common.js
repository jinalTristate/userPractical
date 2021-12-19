const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config()
const promise = require('bluebird');
const responseHelper = require('./responseHelper');
const nodemailer = require('nodemailer');

class common {

    validateLanguage(req, res, next) {
        if (req.headers.language == undefined || req.headers.language == '') {
            responseHelper.sendErrorresponse(res, 'en', 'LANG_NOT_FOUND');
            return;
        }
        next();
    }

    validateToken(req, res, next) {
        //console.log("validateToken ::: ", req.headers.auth_token);
        if (req.headers.auth_token == undefined || req.headers.auth_token == '') {
            responseHelper.sendErrorresponse(res, 'en', 'TOKEN_NOT_FOUND');
            return;
        }
        next();
    }

    async validatePassword(db_password, body_password) {
        try {
            var result = bcrypt.compareSync(body_password, db_password);
            return result
        } catch (error) {
            return promise.reject(error)
        }
    }

    getCurrentTimeStamp() {
        let date = new Date()
        return { date: date, timestamp: Math.floor(date.getTime() / 1000) }
    }
    getRandomPassword() {
        return new promise((resolve, reject) => {
            var password = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&";

            for (var i = 0; i < 10; i++) {
                password += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            resolve(password);
        })
    }

    generateHashAndSalt(pwd) {
        return new promise((resolve, reject) => {
            module.exports.getRandomPassword()
                .then((password) => {
                    bcrypt.genSalt(10, function (err, salt) {
                        let pass;
                        if (pwd != undefined) {
                            pass = pwd;
                        } else {
                            pass = password;
                        }
                        bcrypt.hash(pass, salt, function (err, hash) {
                            if (err) {
                                //     console.log(err);
                            }
                            // Store hash in your password DB.
                            var obj = {
                                password: pass,
                                salt: salt,
                                hash: hash
                            }
                            resolve(obj);
                        });
                    })

                });
        })
    }
    sendEmail(to, obj) {
        console.log("Send email to ::: ", process.env.SMTPPASSWORD);
        var transporter = nodemailer.createTransport({
            host: process.env.SMTPHOST,
            port: process.env.SMTPPORT,
            secure: false,
            service: process.env.SMTPSERVICE,
            auth: {
                user: process.env.SMTPEMAIL,
                pass: process.env.SMTPPASSWORD
            },
            tls: { rejectUnauthorized: false }
        });
        var mailOptions = {
            from: process.env.SMTPEMAIL,
            to: to
        };
        mailOptions.html = `${obj}`
        mailOptions.subject = `Verify Email Request For User Registration`;
        
        mailOptions.html = `${obj}`
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }

}

module.exports = new common();