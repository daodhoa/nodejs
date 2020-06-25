const express = require('express');
const route = express.Router();
const User = require('../models/User');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync();
const jwt = require('jsonwebtoken');
const authCheck = require('./authCheck');

const registerSchema = Joi.object({
    name: Joi.string().min(6),
    email: Joi.string().email(),
    password: Joi.string().min(6)
});

const loginSchema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().min(6)
});

// Register with email and password, name
route.post('/register', async (req, res) => {
    const validation = registerSchema.validate(req.body);
    const err = validation.error;
    if (err) {
        return res.status(400).json({message: err.details[0].message});
    }
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) {
        return res.status(400).json({message: 'Email has already taken!'});
    }
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, salt)
    });
    try {
        const newUser = await user.save();
        res.send({
            "status": "success",
            "data": {
                "name": newUser.name,
                "email": newUser.email
            }
        });
    } catch (error) {
        res.send(error);
    }
});

// Login with email and password
route.post('/signin', async (req, res) => {
    const validation = loginSchema.validate(req.body);
    const err = validation.error;
    if (err) {
        return res.status(400).json({message: err.details[0].message});
    }

    const email = req.body.email;
    const password = req.body.password;
    
    const user = await User.findOne({email: email});
    if (!user) {
        return res.status(401).json({message : 'Email not match'});
    }

    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({message : 'Wrong password!'})
    }

    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);

    return res.status(200).json({
        user : {
            _id: user._id,
            name: user.name,
            email: user.email
        }, 
        access_token: token
    });

});

// Get me
route.get('/me', authCheck, async (req, res) => {
    const userId = req.user._id;
    try {
        const user = await User.findById(userId);
        return res.status(200).json({
            'name': user.name,
            'email': user.email
        });
    } catch (error) {
        return res.status(401).json(error);
    }
});

module.exports = route;