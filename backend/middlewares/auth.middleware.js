const tokenService = require("../services/token.service")
module.exports = function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
            let accessToken = authorizationHeader.split(' ')[1];
            const userData = tokenService.validateAccessToken(accessToken);
            if (userData) {
                req.user = userData;
                return next(); 
            }
        }

        if (req.user) { 
            return next(); 
        }

        return next(res.status(401).send("Authentication required")); 

    } catch (e) {
        console.error("Authentication middleware error:", e);
        return next(res.status(500).send("Server error"));
    }
};