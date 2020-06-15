const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cryptoRandomString = require('crypto-random-string');
const MailerUtil = require('../utils/sendMail');
const config = require('../config');

exports.register = async (req, res) => {
    const { app_name, email, password, phoneNumber, fullname, username } = req.body;
    try {
        const userExists = await User.findOne({ username, app_name });
        if (userExists) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const generatedToken = cryptoRandomString({length: 15, type: 'url-safe'});
        const user = new User({
            username,
            app_name,
            email,
            password: hashedPassword,
            phoneNumber,
            fullname,
            verificationToken: generatedToken,
        });
        const savedUser = await user.save();
        if (email) {
            const verifyUrl = `http://localhost:${config.PORT}/api/v1/auth/verify-account/${savedUser.email}-${generatedToken}`;
            await MailerUtil.sendMail(
                savedUser.email, 
                'Registration Successful',
                `
                    <p>Hello ${savedUser.email}, </p>
                    <p>Thank you for registering on <b><span style="color: red;">${app_name}</span></b>.</p>
                    <p>You can verify your account using this <a href=${verifyUrl}>link</a></p>
                    <br>
                    <p>For more enquiries, contact us via this <a href="mailto: ${config.MAIL_USERNAME}">account</a></p>
                    <br>
                    <br>
                    <p>Best Regards, <b><span style="color: red;">${app_name}</span></b>/p>
                `
            );
            return res.status(201).json({
                message: 'Account registration was successful. Please check your mail to verify your account',
            });
        }
        return res.status(201).json({
            message: 'Account registration was successful.',
        });
    } catch (error) {
        console.log('Error from user sign up >>>> ', error);
        return res.status(500).json({
            message: 'Something went wrong. Please Try again.',
        });
    }
};

exports.verifyAccount = async (req, res) => {
    const { email, token } = req.params;
    try {

        const user = await User.findOneAndUpdate(
            { 
                email, 
                verificationToken: token 
            }, 
            { 
                isVerified: true, 
                verificationToken: null 
            }, 
            { 
                new: true 
            }
        );
        if (!user) {
			return res.status(404).json({
				message: `Account ${email} doesn't exist. or ensure you enter the right url`,
			});
        }
        return res.status(200).json({
            message: 'User account has been verified successfuly. You can login.'
        });
    } catch (error) {
        console.log('Error from user verification >>>> ', error);
        return res.status(500).json({
            message: 'Something went wrong. Please Try again.',
        });
    }
};

exports.login = async (req, res) => {
    const { username, password, app_name, email } = req.body;
    try {
        const user = await User.findOne({ username, app_name });
        if (!user) {
            return res.status(423).json({
                message: 'Ensure you enter the right credentials'
            });
        }
        if (email) {
            if (!user.isVerified) {
                return res.status(409).json({
                    message: 'You have to verify your account'
                });
            }
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(403).json({
                message: 'Ensure you enter the right crendentials',
            });
        }
        const token = jwt.sign(
            {
                email: user.email,
                role: user.role,
                username: user.username,
                id: user._id,
                app: user.app_name,
            },
            config.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        );
        return res.status(200).json({
            message: "User signed in successfully",
            user,
            token
        });
    } catch (error) {
        console.log('Error from user sign in >>>> ', error);
        return res.status(500).json({
            message: 'Something went wrong. Please Try again.',
        });
    }
};