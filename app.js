const jsonwebtoken = require('jsonwebtoken')
const express = require('express')
const app = express()
const SECRET = 'secret'

const db = [
    {
        username: 'jasmine',
        age: 22,
        email: 'jasmine@gmail.com',
        password: 'jasmine123',
        balance: 99999999
    },

    {
        username: 'tram',
        age: 20,
        email: 'tram@gmail.com',
        password: 'tramqwe',
        balance: 55555555
    }
]

app.use(express.json())

app.post('/users/login', (req, res, next) => {
    const username = req.query.username
    const password = req.query.password

    // find user in database
    const user = db.find(user => user.username == username)
    if (!user) {
        res.status(401).json({ message: 'user not found' })
        return
    }
    // check password
    if (user.password == password) {
        res.status(200).json(user)

        const jwt = jsonwebtoken.sign({
            username: username,
            email: user.email,
            age: user.age
        }, SECRET, {
            algorithm: 'HS256',
            expiresIn: '1h'
        })

        next()
        return jwt
    } else {
        res.status(401).json({ message: 'wrong password' })
        return
    }
})

app.get('/users/balance', (req, res, next) => {
    const username = req.query.username

    // get token from request
    const authorizationHeader = req.headers.authorization
    console.log('authorizationHeader: ', authorizationHeader)
    // authoriztionHeader = Bearer<Token>
    // -> token : authorizationHeader.substring(7)
    const userToken = authorizationHeader.substring(7)

    // verify token
    try {
        const receivedPayload = jsonwebtoken.verify(userToken, SECRET)

        // authorization successful
        if (receivedPayload.user === username) {
            const user = db.find(user => user.username === username)
            return res.status(200).json({ balance: user.balance })
        }

        // authorization failed

    } catch (err) {
        return res.status(401).json({ message: err.message })
    }
})

app.listen(3000)