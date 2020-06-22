const { App, User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cryptoRandomString = require('crypto-random-string');
const sendMail = require('../utils/sendMail');
const config = require('../config');

exports.register = async (req, res) => {
    const { username, password, phoneNumber, fullname, email } = req.body;
    const { app_name, app_unique_key, app_nice_name } = req.app;
    console.log(req.app);
    try {
        // let user;
        const appExists = await App.findOne({ app_name });
        if (!appExists) {
            return res.status(400).json({
                message: 'Please make sure the app you\'re signing up for is registered '
            });
        }
        if (app_unique_key === 'username') {
            const userExists = await User.findOne({ username, app_name });
            if (userExists) {
                return res.status(409).json({
                    message: ' User already exists with that username on this application ',
                });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({
                app_name,
                app_nice_name,
                username,
                password: hashedPassword,
                phoneNumber,
                fullname,
                isVerified: true,
            });
            const savedUser = await user.save();
            // appExists.users.push(savedUser._id);
            const app = await App.findOneAndUpdate(
                { 
                    app_name, 
                }, 
                { 
                    $push: {
                        users: savedUser._id,
                    } 
                }, 
                { 
                    new: true 
                }
            );
            return res.status(201).json({
                status: 'success',
                message: 'Account registration successful. You may login',
                username
            });
        } else if (app_unique_key === 'email') {
                const userExists = await User.findOne({ email, app_name });
            if (userExists) {
                return res.status(409).json({
                    message: 'User already exists with that email on this application'
                });
            }
            const hashedPw = await bcrypt.hash(password, 10);
            const generatedToken = cryptoRandomString({length: 15, type: 'url-safe'});
            const user = new User({
                app_name,
                app_nice_name,
                email,
                password: hashedPw,
                phoneNumber,
                fullname,
                verificationToken: generatedToken,
            });
            const savedUser = await user.save();
            const verifyUrl = `http://${req.headers.host}/api/v1/auth/verify-account/${savedUser.email}-${generatedToken}`;
            // appExists.users.push(savedUser._id);
            const app = await App.findOneAndUpdate(
                { 
                    app_name, 
                }, 
                { 
                    $push: {
                        users: savedUser._id,
                   } 
                }, 
                { 
                    new: true 
                }
            );
            sendMail(
                app_nice_name,
                savedUser.email, 
                'Registration Successful',
                `
                    <p>Hello ${savedUser.email}, </p>
                    <p>Thank you for registering on <b><span style="color: red;">${app_nice_name}</span></b>.</p>
                    <p>You can verify your account using this <a href=${verifyUrl}>link</a></p>
                    <br>
                    <p>For more enquiries, contact us via this <a href="mailto: ${config.MAIL_USERNAME}">account</a></p>
                    <br>
                    <br>
                    <p>Best Regards, <b><span style="color: red;">${app_nice_name}</span></b>/p>
                `
            );
            return res.status(201).json({
                message: 'Account registration was successful. Please check your mail to verify your account',
            });
        } 
    } catch (error) {
        console.log('Error from user sign up >>>> ', error);
        return res.status(500).json({
            message: 'Something went wrong. Please Try again.',
        });
    }
};

// only required for applications using email as unique key field
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
    try {
        const { username, password, email } = req.body;
        const { app_name, app_nice_name, app_unique_key } = req.app;
        const app = await App.findOne({ app_name });
        if (!app) {
            return res.status(400).json({
                status: "error",
                message: "Missing app credentials. App doesn't exist"
            });
        }
        if (app_unique_key === 'username') {
            const user = await User.findOne({ username, app_name });
            if (!user) {
                return res.status(400).json({
                    message: 'Ensure you enter the right credentials'
                });
            }
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return res.status(401).json({
                    message: 'Ensure you enter the right crendentials',
                });
            }
            const token = jwt.sign(
                {
                    email: user.email,
                    role: user.role,
                    username: user.username,
                    userId: user._id,
                    app: user.app_name,
                },
                config.JWT_SECRET,
                {
                    expiresIn: '1d'
                }
            );
            return res.status(200).json({
                message: `User signed in to ${user.app_nice_name} application successfully`,
                user,
                token
            });
        } else if (app_unique_key === 'email') {
            const user = await User.findOne({ email, app_name });
            if (!user) {
                return res.status(400).json({
                    message: 'Ensure you enter the right credentials'
                });
            }
            if (!user.isVerified) {
                return res.status(401).json({
                    message: 'You have to verify your account'
                });
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
                    userId: user._id,
                    app: user.app_name,
                },
                config.JWT_SECRET,
                {
                    expiresIn: '1d'
                }
            );
            return res.status(200).json({
                message: `User signed in to ${user.app_nice_name} application successfully`,
                user,
                token
            });
        }
    } catch (error) {
        console.log('Error from user sign in >>>> ', error);
        return res.status(500).json({
            message: 'Something went wrong. Please Try again.',
        });
    }
};

exports.checkStatus = async (req, res) => {
    try {
        const { app, username, email } = req.user;
        const user = await User.findOne({
            app_name: app,
            email,
            username
        })
        .select('-__v -password -verificationToken -role');
        if (!user) {
            return res.status(403).json({
                status: 'error',
                message: 'Ensure you\'re logged in!!'
            });
        }
        return res.status(200).json({
            status: 'success',
            message: 'User details',
            data: user
        });
    } catch (error) {
        console.log('Error from fetching user status >>>> ', error);
        return res.status(500).json({
            message: 'Something went wrong. Please Try again.',
        });
    }
};