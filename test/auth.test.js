const request = require("supertest")
const app = require("../app")
const { sequelize } = require("../models")
const { hashPassword } = require("../middlewares/bcrypt")
const { queryInterface } = sequelize

const user1 = {
    email: "user.test1@mail.com",
    password: hashPassword("usertest"),
    createdAt: new Date(),
    updatedAt: new Date()
}

beforeAll(async () => {
    await queryInterface.bulkInsert("Users", [user1])
})

afterAll(async () => {
    await queryInterface.bulkDelete("Users", null, { cascade: true, restartIdentity: true, truncate: true })
})

describe("User Routes Test", () => {
    describe("POST /register - create new user", () => {
        test("201 Success register - should create new User", (done) => {
            request(app)
                .post("/register")
                .send({
                    email: "user.test2@mail.com",
                    password: "usertest",
                })
                .end((err, res) => {
                    if (err) return done(err)
                    const { body, status } = res

                    expect(status).toBe(201)
                    expect(body).toHaveProperty("email", "user.test2@mail.com")
                    return done()
                })
        })

        test("400 Failed register - should return error if email is null", (done) => {
            request(app)
                .post("/register")
                .send({
                    username: "User Test",
                    password: "usertest",
                })
                .end((err, res) => {
                    if (err) return done(err)
                    const { body, status } = res

                    expect(status).toBe(400)
                    return done()
                })
        })
    })

    describe("POST /login - user login", () => {
        test("200 Success login - should return access_token", (done) => {
            request(app)
                .post("/login")
                .send({
                    email: "user.test1@mail.com",
                    password: "usertest",
                })
                .end((err, res) => {
                    if (err) return done(err)
                    const { body, status } = res

                    expect(status).toBe(200)
                    expect(body).toHaveProperty("access_token", expect.any(String))
                    return done()
                })
        })

        test("400 Failed login - should return error if password is wrong", (done) => {
            request(app)
                .post("/login")
                .send({
                    email: "user.test1@mail.com",
                    password: "salahpassword",
                })
                .end((err, res) => {
                    if (err) return done(err)
                    const { body, status } = res

                    expect(status).toBe(400)
                    expect(body).toHaveProperty("message", "Email or password are wrong")
                    return done()
                })
        })

        test("401 Failed login - should return error if email is null", (done) => {
            request(app)
                .post("/login")
                .send({
                    password: "salahpassword",
                })
                .end((err, res) => {
                    if (err) return done(err)
                    const { body, status } = res

                    expect(status).toBe(400)
                    expect(body).toHaveProperty("message", "Email and password cannot be empty")
                    return done()
                })
        })

        test("401 Failed login - should return error if password is null", (done) => {
            request(app)
                .post("/login")
                .send({
                    email: "hello@mail.com",
                })
                .end((err, res) => {
                    if (err) return done(err)
                    const { body, status } = res

                    expect(status).toBe(400)
                    expect(body).toHaveProperty("message", "Email and password cannot be empty")
                    return done()
                })
        })
    })
})
