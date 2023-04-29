const jwt = require('jsonwebtoken');


verifyToken = (req, res) => {
    let token = req.body.token;
    let responseData = {}
    if(token){

        const decode = jwt.verify(token, 'secret');
        responseData = {
            login: true,
            data: decode
        }
    }else{
        responseData = {
            login: false,
            data: 'error'
        }
    }

    return responseData;

}

module.exports = verifyToken;