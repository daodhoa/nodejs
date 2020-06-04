const Product = require('../models/Product');
const express = require('express');
const route = express.Router();
const authCheck = require('../routes/authCheck');

route.get('/', authCheck, (req, res) => {
    return res.status(200).json({
        post: {
            title: "Nodejs",
            description: "The best"
        }
    });
});

module.exports = route;