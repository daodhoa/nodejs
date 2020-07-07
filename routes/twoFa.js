const User = require('../models/User');
const express = require('express');
const route = express.Router();
const authCheck = require('./authCheck');
const twoFactor = require('node-2fa');

route.post('/enable', authCheck, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const newSecret = twoFactor.generateSecret({
            name: 'Best App',
            account: user.email
        })
        user.auth_secret = newSecret.secret;
        await user.save();
        return res.status(200).json(newSecret);
    } catch (error) {
        return res.status(400).json(error);
    }
});

route.post('/verify', authCheck, async (req, res) => {
    const code = req.body.code;
    console.log(code);
    try {
        const user = await User.findById(req.user._id);
        const result = twoFactor.verifyToken(user.auth_secret, code);
        return res.json(result);
    } catch (error) {
        return res.status(400).json(error);
    }
});

module.exports = route;