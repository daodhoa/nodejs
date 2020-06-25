const Task = require('../models/Task');
const express = require('express');
const route = express.Router();
const authCheck = require('./authCheck');

route.get('/', authCheck, (req, res) => {
    return res.status(200).json({
        post: {
            title: "Nodejs",
            description: "The best"
        }
    });
});

module.exports = route;