const express = require("express")
const Controller = require("../controllers/funds")
const router = express.Router()

router.get("/", Controller.getFunds)

router.get("/:id", Controller.getFundById)

module.exports = router