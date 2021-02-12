const jwt = require('jsonwebtoken');
const {secret} = require('./token.js');
const functionFile = 'authenticate-middleware.js';

module.exports = (req, res, next) => {
    const token = req.headers.authorization;
    if(token){
        jwt.verify(token, secret, (err, decodedToken) => {
            if(err){ throw `${functionFile} 401`; }
            else{
                req.user = {id: decodedToken.userID};
                next();
            }
        });
    }
    else{ throw `${functionFile} 400`; }
};