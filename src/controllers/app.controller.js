const { App } = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.registerApp = async (req, res) => {
    try {
        const { app_name, app_nice_name, app_unique_key } = req.body;
        const appExists = await App.findOne({ app_name });
        if (appExists) {
            return res.status(409).json({
                message: `Application with the app name ${app_name.toUpperCase()} already exists`
            });
        }
        const aYearFromNow = new Date(new Date().setFullYear(new Date().getFullYear() + 1 )).toUTCString();
        const app = new App({
            app_name,
            app_nice_name,
            app_unique_key,
            expires_on: aYearFromNow
        });
        const savedApp = await app.save();
        const token = jwt.sign(
            { 
                appId: savedApp._id,
                app_name: savedApp.app_name,
                app_nice_name: savedApp.app_nice_name,
                app_unique_key: savedApp.app_unique_key, 
            },
            config.JWT_SECRET,
            {
                expiresIn: '1y'
            }
        );
        return res.status(201).json({
            message: `${savedApp.app_nice_name} Application was added successfully`,
            app,
            expires_on: savedApp.expires_on,
            token
        });
    } catch (error) {
        console.log('Error from adding application >>>> ', error);
        return res.status(500).json({
            message: 'Something went wrong. Please Try again.',
        });
    }
};

exports.getApp = async (req, res) => {
    try {
        const { app, role } = req.user;
        if (role !== 'ADMIN') {
            return res.status(403).json({
                status: 'error',
                message: 'Access Denied. Check Missing Credentials.'
            });
        }
        const application = await App.findOne({ app_name: app }).populate('users');
        if (!application) {
            return res.status(409).json({
                message: 'Application doesn\'t exist. Check Missing Credentials.'
            });
        }
        return res.status(200).json({
            message: 'App found',
            details: application
        });
    } catch (error) {
        console.log('Error from fetching app details >>>> ', error);
        return res.status(500).json({
            message: 'Something went wrong. Please Try again.',
        });
    }
};