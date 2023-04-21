const express = require('express')
const connection = require('../database/connection')
require('dotenv').config({ path: '.env' })
const jsonwebtoken = require('jsonwebtoken')
const loginRouter = express.Router()

function createJwt(id_input, username_input, age_input, email_input, balance_input) {
    return jsonwebtoken.sign({
        id: id_input,
        username: username_input,
        age: age_input,
        email: email_input,
        balance: balance_input
    }, process.env.SECRET, {
        algorithm: 'HS256', // algorithm for hashing data in signature section => HS256(header + payload, SECRET)
        expiresIn: '1d', // thoi gian sd jwt
        issuer: 'jasmine_chamcham' // nguoi cap phat jwt
    })
}

loginRouter.get('/login', function (req, res) {
    const username = req.query.username
    const password = req.query.password

    console.log("username = ", username, 'pw = ', password)

    const user = connection.query('select * from user where username=?', [username],
        (err, rs) => {
            if (err) {
                res.status(401).send(err)
                return
            }

            let pw_received = rs;
            for (let instance of rs) {
                if (instance.password === password) {
                    const userToken = createJwt(instance.id, username, instance.age, instance.email, instance.balance)
                    const receivedPayload = jsonwebtoken.verify(userToken, process.env.SECRET)
                    res.status(200).json(receivedPayload)
                }
            }

        })
})



module.exports = loginRouter