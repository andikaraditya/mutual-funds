const { verify } = require('jsonwebtoken');
const {User} = require('../models');

async function authentication(req, res, next) {
    try {
        const {access_token} = req.headers

        if (!access_token) {
            throw {name: "Unauthenticated", message: "Authentication error"}
        }

        const payload = verify(access_token, process.env.JWT_SECRET)

        const user = await User.findOne({
            where: {
                email: payload.email
            }
        })

        if (!user) {
            throw {name: "Unauthenticated", message: "Authentication error"}
        }

        req.user = payload

        next()
    } catch (error) {
        next(error)
    }
}

module.exports = authentication