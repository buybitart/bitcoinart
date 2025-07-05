const jwt = require('jsonwebtoken');
const {user} = require('../models/users');

class TokenService {
    generateTokens(payload) {
        console.log(payload)
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
        return {
            accessToken,
            refreshToken
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (e) {
            console.log(e)
            return null;
        }
    }

    async removeToken(refreshToken) {
        const userData = await user.findOne({"refreshToken":refreshToken})
        userData.refreshToken = ""
        await userData.save()
        return userData;
    }

    async findToken(refreshToken) {
        const tokenData = await user.findOne({refreshToken})
        return tokenData;
    }
}

module.exports = new TokenService();
