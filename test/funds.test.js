const { sign } = require("jsonwebtoken")
const request = require("supertest")
const app = require("../app")
const { sequelize } = require("../models")
const { hashPassword } = require("../middlewares/bcrypt")
const { queryInterface } = sequelize

let access_token

const user1 = {
    email: "user.test1@mail.com",
    password: hashPassword("usertest"),
    createdAt: new Date(),
    updatedAt: new Date(),
}

beforeAll(async () => {
    await queryInterface.bulkInsert("Users", [user1])

    access_token = sign({ id: 1, email: "user.test1@mail.com" }, process.env.JWT_SECRET)

    await queryInterface.bulkInsert("Companies", [
        {
            name: "PT. Investasi Jaya",
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: "PT. Makmur Investasi",
            createdAt: new Date(),
            updatedAt: new Date()
        },
    ])

    await queryInterface.bulkInsert("Funds", [
        {
            name: "Agro Funds",
            value: 200000,
            quantity: 2000,
            totalValue: 200000 * 2000,
            createdAt: new Date(),
            updatedAt: new Date(),
            CompanyId: 1
        },
        {
            name: "Creative Funds",
            value: 150000,
            quantity: 2500,
            totalValue: 150000 * 2500,
            createdAt: new Date(),
            updatedAt: new Date(),
            CompanyId: 1
        },
        {
            name: "Tourism Funds",
            value: 200000,
            quantity: 1000,
            totalValue: 200000 * 1000,
            createdAt: new Date(),
            updatedAt: new Date(),
            CompanyId: 1
        },
        {
            name: "Manufacture Funds",
            value: 300000,
            quantity: 3000,
            totalValue: 300000 * 3000,
            createdAt: new Date(),
            updatedAt: new Date(),
            CompanyId: 1
        },
        {
            name: "Bonds",
            value: 100000,
            quantity: 10000,
            totalValue: 100000 * 10000,
            createdAt: new Date(),
            updatedAt: new Date(),
            CompanyId: 2
        },
        {
            name: "Oil Funds",
            value: 500000,
            quantity: 1000,
            totalValue: 500000 * 1000,
            createdAt: new Date(),
            updatedAt: new Date(),
            CompanyId: 2
        },
    ])

    await request(app)
        .post("/funds/buy/2")
        .set({access_token})
        .send({
            quantity: 20
        })
})

afterAll(async () => {
    await queryInterface.bulkDelete("Users", null, {
        cascade: true,
        restartIdentity: true,
        truncate: true,
    })

    await queryInterface.bulkDelete("Funds", null, {
        cascade: true,
        restartIdentity: true,
        truncate: true,
    })

    await queryInterface.bulkDelete("UserFunds", null, {
        cascade: true,
        restartIdentity: true,
        truncate: true,
    })

    await queryInterface.bulkDelete("Transactions", null, {
        cascade: true,
        restartIdentity: true,
        truncate: true,
    })
})

describe("GET Funds test", () => {
    test("200 Success get all funds", (done) => {
        request(app)
            .get("/funds")
            .set({access_token})
            .end((error, response) => {
                if (error) return done(error)
                expect(response.status).toBe(200)
                expect(response.body[0]).toEqual(expect.any(Object))
                expect(response.body[0].name).toEqual(expect.any(String))
                expect(response.body[0].value).toEqual(expect.any(Number))
                expect(response.body[0].quantity).toEqual(expect.any(Number))
                expect(response.body[0].totalValue).toEqual(expect.any(Number))
                return done()
            })
    })

    test("401 Failed to get funds - no access token", (done) => {
        request(app)
            .get("/funds")
            .end((error, response) => {
                if (error) return done(error)
                expect(response.status).toBe(401)
                return done()
            })
    })

    test("401 Failed to get funds - access token malformed", (done) => {
        request(app)
            .get("/funds")
            .set({access_token: "asdfibaifu"})
            .end((error, response) => {
                if (error) return done(error)
                expect(response.status).toBe(401)
                return done()
            })
    })

    test("200 Success get funds by Id", (done) => {
        request(app)
            .get("/funds/item/1")
            .set({access_token})
            .end((error, response) => {
                if (error) return done(error)
                expect(response.status).toBe(200)
                expect(response.body).toEqual(expect.any(Object))
                expect(response.body.name).toEqual(expect.any(String))
                expect(response.body.value).toEqual(expect.any(Number))
                expect(response.body.quantity).toEqual(expect.any(Number))
                expect(response.body.totalValue).toEqual(expect.any(Number))
                return done()
            })
    })

    test("200 Success get all owned funds", (done) => {
        request(app)
            .get("/funds/owned")
            .set({access_token})
            .end((error, response) => {
                if (error) return done(error)
                expect(response.status).toBe(200)
                expect(response.body[0]).toEqual(expect.any(Object))
                expect(response.body[0].quantity).toEqual(expect.any(Number))
                expect(response.body[0].totalValue).toEqual(expect.any(Number))
                expect(response.body[0].Fund.name).toEqual(expect.any(String))
                return done()
            })
    })
})

describe("POST Buy funds test", () => {
    test("201 Success to buy new funds", (done) => {
        request(app)
            .post("/funds/buy/3")
            .set({access_token})
            .send({
                quantity: 10
            })
            .end((error, response) => {
                if (error) return done(error)
                expect(response.status).toBe(201)
                expect(response.body).toEqual(expect.any(Object))
                expect(response.body.type).toEqual(expect.any(String))
                expect(response.body.quantity).toEqual(expect.any(Number))
                expect(response.body.totalValue).toEqual(expect.any(Number))
                return done()
            })
    })
    test("201 Success to buy already owned funds", (done) => {
        request(app)
            .post("/funds/buy/2")
            .set({access_token})
            .send({
                quantity: 10
            })
            .end((error, response) => {
                if (error) return done(error)
                expect(response.status).toBe(201)
                expect(response.body).toEqual(expect.any(Object))
                expect(response.body.type).toEqual(expect.any(String))
                expect(response.body.quantity).toEqual(expect.any(Number))
                expect(response.body.totalValue).toEqual(expect.any(Number))
                return done()
            })
    })

    test("400 Error to buy funds - quantity too high", (done) => {
        request(app)
            .post("/funds/buy/2")
            .set({access_token})
            .send({
                quantity: 1000000
            })
            .end((error, response) => {
                if (error) return done(error)
                expect(response.status).toBe(400)
                expect(response.body).toHaveProperty("message", "Order quantity is more than available funds")
                return done()
            })
    })

    test("400 Error to buy funds - quantity is null", (done) => {
        request(app)
            .post("/funds/buy/2")
            .set({access_token})
            .end((error, response) => {
                if (error) return done(error)
                expect(response.status).toBe(400)
                expect(response.body).toHaveProperty("message", "All forms must be filled")
                return done()
            })
    })
})

describe("POST Sell funds test", () => {
    test("201 Success to sell funds", (done) => {
        request(app)
            .post("/funds/sell/2")
            .set({access_token})
            .send({
                quantity: 5
            })
            .end((error, response) => {
                if (error) return done(error)
                expect(response.status).toBe(201)
                expect(response.body).toEqual(expect.any(Object))
                expect(response.body.type).toEqual(expect.any(String))
                expect(response.body.quantity).toEqual(expect.any(Number))
                expect(response.body.totalValue).toEqual(expect.any(Number))
                return done()
            })
    })

    test("400 Error to sell funds - quantity too high", (done) => {
        request(app)
            .post("/funds/sell/2")
            .set({access_token})
            .send({
                quantity: 1000000
            })
            .end((error, response) => {
                if (error) return done(error)
                expect(response.status).toBe(400)
                expect(response.body).toHaveProperty("message", "Sell quantity is more than owned funds")
                return done()
            })
    })

    test("400 Error to sell funds - quantity is null", (done) => {
        request(app)
            .post("/funds/sell/2")
            .set({access_token})
            .end((error, response) => {
                if (error) return done(error)
                expect(response.status).toBe(400)
                expect(response.body).toHaveProperty("message", "All forms must be filled")
                return done()
            })
    })

    test("400 Error to sell funds - funds isn't owned", (done) => {
        request(app)
            .post("/funds/sell/5")
            .set({access_token})
            .send({
                quantity: 5
            })
            .end((error, response) => {
                if (error) return done(error)
                expect(response.status).toBe(400)
                expect(response.body).toHaveProperty("message", "User do not own that funds")
                return done()
            })
    })
})


describe("POST Switch funds test", () => {
    test("201 Success to switch funds", (done) => {
        request(app)
            .post("/funds/switch/3")
            .set({access_token})
            .send({
                sellQuantity: 5,
                FundId: 2
            })
            .end((error, response) => {
                if (error) return done(error)
                expect(response.status).toBe(201)
                expect(response.body).toEqual(expect.any(Object))
                expect(response.body.type).toEqual(expect.any(String))
                expect(response.body.quantity).toEqual(expect.any(Number))
                expect(response.body.totalValue).toEqual(expect.any(Number))
                return done()
            })
    })

    test("400 Error to switch funds - quantity too high", (done) => {
        request(app)
            .post("/funds/switch/3")
            .set({access_token})
            .send({
                sellQuantity: 100000,
                FundId: 2
            })
            .end((error, response) => {
                if (error) return done(error)
                expect(response.status).toBe(400)
                expect(response.body).toHaveProperty("message", "Not enough funds to switch")
                return done()
            })
    })

    test("400 Error to switch funds - switch target is same", (done) => {
        request(app)
            .post("/funds/switch/2")
            .set({access_token})
            .send({
                sellQuantity: 2,
                FundId: 2
            })
            .end((error, response) => {
                if (error) return done(error)
                expect(response.status).toBe(400)
                expect(response.body).toHaveProperty("message", "Cannot switch to same funds")
                return done()
            })
    })

    test("400 Error to switch funds - not enough buying power", (done) => {
        request(app)
            .post("/funds/switch/1")
            .set({access_token})
            .send({
                sellQuantity: 1,
                FundId: 2
            })
            .end((error, response) => {
                if (error) return done(error)
                expect(response.status).toBe(400)
                expect(response.body).toHaveProperty("message", "Not enough funds to switch")
                return done()
            })
    })

    test("400 Error to switch funds - switch to different company", (done) => {
        request(app)
            .post("/funds/switch/6")
            .set({access_token})
            .send({
                sellQuantity: 1,
                FundId: 2
            })
            .end((error, response) => {
                if (error) return done(error)
                expect(response.status).toBe(400)
                expect(response.body).toHaveProperty("message", "Cannot switch funds to different company")
                return done()
            })
    })
})