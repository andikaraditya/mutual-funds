const {Fund, UserFund, Transaction, sequelize} = require('../models');

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

    static async getOwnedFunds(req, res, next) {
        try {
            const ownedFunds = await UserFund.findAll({
                where: {
                    UserId: req.user.id
                },
                include: {
                    model: Fund,
                    attributes: ["name"]
                }
            })

            res.status(200).json(ownedFunds)
        } catch (error) {
            next(error)
        }
    }

    static async buyFunds(req, res, next) {
        const t = await sequelize.transaction()
        try {
            const {id:fundId} = req.params

            const {quantity} = req.body

            const fund = await Fund.findByPk(fundId, {transaction: t})

            if (!quantity) {
                throw {name: "BadRequest", message: "All forms must be filled"}
            }

            if (quantity > fund.quantity) {
                throw {name: "BadRequest", message: "Order quantity is more than available funds"}
            }

            let userFund = await UserFund.findOne({
                where: {
                    FundId: fundId
                }
            }, {transaction: t})

            // console.log(req.user)

            if (!userFund) {
                userFund = await UserFund.create({
                    UserId: req.user.id,
                    FundId: fundId,
                    quantity: quantity,
                    totalValue: quantity * fund.value
                }, {transaction: t})
            } else {
                userFund.update({
                    quantity: Number(userFund.quantity) + Number(quantity),
                    totalValue: (Number(userFund.quantity) + Number(quantity)) * fund.value
                }, {transaction: t})
            }

            const transaction = await Transaction.create({
                UserId: req.user.id,
                FundId: fundId,
                type: "buy",
                quantity: quantity,
                totalValue: quantity * fund.value
            }, {transaction: t})

            await fund.update({
                quantity: Number(fund.quantity) - Number(quantity)
            }, {transaction: t})

            await t.commit()
            res.status(201).json(transaction)
        } catch (error) {
            await t.rollback()
            next(error)
        }
    }
}

module.exports = Controller