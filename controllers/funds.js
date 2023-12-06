const {Fund, UserFund, Transaction} = require('../models');

class Controller {
    static async getFunds(req, res, next) {
        try {
            const funds = await Fund.findAll()

            res.status(200).json(funds)
        } catch (error) {
            next(error)
        }
    }

    static async getFundById(req, res, next) {
        try {
            const {id} = req.params
            const fund = await Fund.findByPk(id)

            res.status(200).json(fund)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = Controller