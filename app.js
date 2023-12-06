if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express")
const Auth = require("./controllers/auth")
const errorHandler = require("./middlewares/errorHandler");
const authentication = require("./middlewares/authentication");
const funds = require("./routes/funds");
const app = express()
const port = 3000

app.use(express.urlencoded())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.post("/register", Auth.handleRegister)

app.post("/login", Auth.handleLogin)

app.use(authentication)

app.use("/funds", funds)

app.use(errorHandler)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
