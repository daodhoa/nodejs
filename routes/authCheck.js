const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const accessToken =  req.header('access_token');
    if (!accessToken) {
        return res.status(422).send('Access token required')
    }
    try {
        const user = jwt.verify(accessToken, process.env.TOKEN_SECRET);
        req.user = user;
        next();   
    } catch (err) {
        res.status(401).send('invalid token');
    }
};
