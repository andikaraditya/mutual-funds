const express = require("express")
const Controller = require("../controllers/funds")
const router = express.Router()

router.get("/", Controller.getFunds)

router.get("/owned", Controller.getOwnedFunds)

router.get("/item/:id", Controller.getFundById)

router.post("/buy/:id", Controller.buyFunds)

module.exports = router