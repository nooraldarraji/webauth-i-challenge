const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors")

const Users = require("./users/users-model.js")
const restricted = require("./middleware/restrict.js")
const session = require("express-session")


const sessionConfig = {
    name: "chocochip",
    secret: process.env.SESSION_SECRET || "keep it secret, keep it safe",
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false,
        httpOnly: true
    },
    resave: false,
    saveUninitialized: true
}

server.use(express.json())
server.use(session(sessionConfig))


server.get("/", (req, res) => {
    res.send("It's alive!")
})

server.post("/api/register", (req, res) => {
    console.log(req.body)
    let { username, password } = req.body

    console.log(username)
    const hash = bcrypt.hashSync(password, 2)

    Users.add({ username, password: hash })
        .then(saved => {
            res
                .status(201)
                .json(saved)
        })
        .catch(error => {
            res
                .status(500)
                .json(error)
        })
})

server.post("/api/login", (req, res) => {
    let { username, password } = req.body

    Users.findBy({ username })
        .first()
        .then(user => {
            req.session.user = user
            if (user && bcrypt.compareSync(password, user.password)) {
                res
                    .json({ message: `Welcome ${user.username}!` })
            } else {
                res
                    .status(401)
                    .json({ message: "You cannot pass!" })
            }
        })
        .catch(error => {
            res
                .status(500)
                .json(error)
        })
})

server.get("/api/users", restricted, (req, res) => {
    Users.find()
        .then(users => {
            res.json(users)
        })
        .catch(err => res.send(err))
})

const port = process.env.PORT || 8000;

server.listen(port, () => console.log(`Listining on port ${port}`));