if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express")
const Auth = require("./controllers/auth")
const errorHandler = require("./middlewares/errorHandler");
const authentication = require("./middlewares/authentication");
const funds = require("./routes/funds");
const app = express()

app.use(express.urlencoded())
app.use(express.json())

app.post("/register", Auth.handleRegister)

app.post("/login", Auth.handleLogin)

app.use(authentication)

app.use("/funds", funds)

app.use(errorHandler)

module.exports = app