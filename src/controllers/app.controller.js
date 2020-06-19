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
        const app = new App({
            app_name,
            app_nice_name,
            app_unique_key,
        });
        const savedApp = await app.save();
        const token = jwt.sign(
            { 
                appId: savedApp._id 
            },
            config.JWT_SECRET,
            {
                expiresIn: '365d'
            }
        );
        return res.status(201).json({
            message: 'Application added successfully',
            app,
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
        const { app_name } = req.params;
        const app = await App.findOne({ app_name }).populate('users');
        if (!app) {
            return res.status(409).json({
                message: 'App doesn\'t exist'
            });
        }
        return res.status(200).json({
            message: 'App found',
            details: app
        });
    } catch (error) {
        console.log('Error from fetching app details >>>> ', error);
        return res.status(500).json({
            message: 'Something went wrong. Please Try again.',
        });
    }
};