const { Op } = require('sequelize');
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
                    [Op.and]: [{FundId: fundId}, {UserId: req.user.id}]
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
                await userFund.update({
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
                quantity: Number(fund.quantity) - Number(quantity),
                totalValue: (Number(fund.quantity) - Number(quantity)) * fund.value
            }, {transaction: t})

            await t.commit()
            res.status(201).json(transaction)
        } catch (error) {
            await t.rollback()
            next(error)
        }
    }

    static async sellFunds(req, res, next) {
        const t = await sequelize.transaction()
        try {
            const {id:fundId} = req.params

            const {quantity} = req.body

            if (!quantity) {
                throw {name: "BadRequest", message: "All forms must be filled"}
            }

            const userFund = await UserFund.findOne({
                where: {
                    [Op.and]: [{FundId: fundId}, {UserId: req.user.id}]
                }
            }, {transaction: t})

            if (!userFund) {
                throw {name: "BadRequest", message: "User do not own that funds"}
            }

            if (quantity > userFund.quantity || userFund.quantity === 0) {
                throw {name: "BadRequest", message: "Sell quantity is more than owned funds"}
            }

            const fund = await Fund.findByPk(fundId, {transaction: t})

            await fund.update({
                quantity: Number(fund.quantity) + Number(quantity),
                totalValue: (Number(fund.quantity) + Number(quantity)) * fund.value
            }, {transaction: t})

            await userFund.update({
                quantity: Number(userFund.quantity) - Number(quantity),
                totalValue: (Number(userFund.quantity) - Number(quantity)) * fund.value
            }, {transaction: t})

            const transaction = await Transaction.create({
                UserId: req.user.id,
                FundId: fundId,
                type: "sell",
                quantity: quantity,
                totalValue: quantity * fund.value
            }, {transaction: t})

            await t.commit()
            res.status(201).json(transaction)
        } catch (error) {
            await t.rollback()
            next(error)
        }
    }

    static async switchFunds(req, res, next) {
        const t = await sequelize.transaction()

        try {
            const {id:buyFundId} = req.params
            const {sellQuantity, FundId:sellFundId} = req.body

            if (buyFundId == sellFundId) {
                throw {name: "BadRequest", message: "Cannot switch to same funds"}
            }

            const sellFund = await Fund.findByPk(sellFundId, {transaction: t})
            const buyFund = await Fund.findByPk(buyFundId, {transaction: t})
            const userFund = await UserFund.findOne({
                where: {
                    [Op.and]: [{FundId: sellFundId}, {UserId: req.user.id}]
                }
            }, {transaction: t})

            if (sellQuantity > userFund.quantity) {
                throw {name: "BadRequest", message: "Not enough funds to switch"}
            }

            const buyPower = Number(sellQuantity) * Number(sellFund.value)

            if (buyPower < buyFund.value) {
                throw {name: "BadRequest", message: "Not enough funds to switch"}
            }
            
            const buyAmount = Math.floor(buyPower / buyFund.value)

            await sellFund.update({
                quantity: Number(sellFund.quantity) + Number(sellQuantity),
                totalValue: (Number(sellFund.quantity) + Number(sellQuantity)) * sellFund.value
            }, {transaction: t})

            await userFund.update({
                quantity: Number(userFund.quantity) - Number(sellQuantity),
                totalValue: (Number(userFund.quantity) - Number(sellQuantity)) * sellFund.value
            }, {transaction: t})

            await buyFund.update({
                quantity: Number(buyFund.quantity) - Number(buyAmount),
                totalValue: (Number(buyFund.quantity) - Number(buyAmount)) * buyFund.value
            }, {transaction: t})

            let newUserFund = await UserFund.findOne({
                where: {
                    [Op.and]: [{FundId: buyFundId}, {UserId: req.user.id}]
                }
            }, {transaction: t})

            // console.log(req.user)

            if (!newUserFund) {
                newUserFund = await UserFund.create({
                    UserId: req.user.id,
                    FundId: buyFundId,
                    quantity: buyAmount,
                    totalValue: buyAmount * buyFund.value
                }, {transaction: t})
            } else {
                await newUserFund.update({
                    quantity: Number(newUserFund.quantity) + Number(buyAmount),
                    totalValue: (Number(newUserFund.quantity) + Number(buyAmount)) * buyFund.value
                }, {transaction: t})
            }

            const transaction = await Transaction.create({
                UserId: req.user.id,
                FundId: buyFundId,
                type: "switch",
                quantity: buyAmount,
                totalValue: buyAmount * buyFund.value
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