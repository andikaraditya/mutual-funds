const { sign } = require('jsonwebtoken');
const { comparePassword } = require('../middlewares/bcrypt');
const {User} = require('../models');

class Auth {
    static async handleRegister(req, res, next) {
        try {
            const {email, password} = req.body

            const user = await User.create({
                email,
                password
            })

            res.status(201).json({id: user.id, email: user.email})
        } catch (error) {
            next(error)
        }
    }

    static async handleLogin(req, res, next) {
        try {
            const {email, password} = req.body

            if (!email || !password) {
                throw {name: "BadRequest", message: "Email and password cannot be empty"}
            }

            const user = await User.findOne({
                where: {
                    email: email
                }
            })

            if (!user) {
                throw {name: "BadRequest", message: "Email or password are wrong"}
            } 

            const isCorrect = comparePassword(password, user.password)

            const token = sign({id: user.id, email: user.email}, process.env.JWT_SECRET)

            res.status(200).json({access_token: token})
        } catch (error) {
            next(error)
        }
    }
}

module.exports = Auth