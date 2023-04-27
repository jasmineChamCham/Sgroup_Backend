const express = require('express')
require('dotenv').config({ path: '.env' })
const jsonwebtoken = require('jsonwebtoken')
const db = require('../database/connection')
const { hashPw, hashPwWithGivenSalt } = require('../helpers/hash')
const authRouter = express.Router()
const SECRET = process.env.SECRET

function validateUser(username, password, next) {
    const regexSpecial = /^[a-zA-Z0-9]+$/;
    // const regexNumber = /^\d+(\.\d+)?$/;

    if (regexSpecial.test(username) && regexSpecial.test(password)) {
        next();
    } else {
        return;
    }
}

authRouter.post('/register', (req, res) => {
    const { username, password, confirm_password, name, age, gender, email } = req.body
    if (password !== confirm_password) {
        return res.json({ message: 'password and confirm_password dont match' })
    }

    db.query('select * from users where username=?', username, (err, rs) => {
        if (err) {
            return res.status(500).json({
                message: ' Internal Server Error'
            })
        }

        const user = rs[0]
        if (user) {
            return res.status(200).json({
                message: ' user is already existed'
            })
        }

        const { hashedPassword, salt } = hashPw(password)
        db.query(`insert into users(username, password, salt, name, age, gender, email)
        values(?, ?, ?, ?, ?, ?, ?)`, [username, hashedPassword, salt, name, age, gender, email],
            (err, rs) => {
                if (err) {
                    return res.status(500).json({
                        message: ' Internal Server Error'
                    })
                }
                return res.status(200).json({ message: ' add user successfully' })
            })
    })
})

authRouter.post('/login', (req, res) => {
    const { username, password } = req.body
    db.query('select * from users where username=?', username, (err, rs) => {
        if (err) {
            return res.status(500).json({
                message: ' Internal Server Error'
            })
        }

        const user = rs[0]
        if (!user) {
            return res.status(200).json({
                message: ' user not found '
            })
        }

        const hashedPassword = hashPwWithGivenSalt(password, user.salt)

        if (hashedPassword == user.password) {
            const jwt = jsonwebtoken.sign({
                id: user.id,
                username: user.username,
                name: user.name,
                age: user.age,
                name: user.name,
                gender: user.gender,
                email: user.email
            }, SECRET, {
                algorithm: 'HS256', // algorithm for hashing data in signature section => HS256(header + payload, SECRET)
                expiresIn: '365d', // thoi gian sd jwt
                issuer: 'sgroup' // nguoi cap phat jwt
            })

            console.log('jwt: ' + jwt)

            req.headers['authorization'] = jwt

            return res.status(200).json({
                jwt: jwt
            })
        } else {
            res.status(200).json({ message: ' wrong password ' })
        }
    })
})

function verifyToken(req, res, next) {
    const token = req.headers['authorization']
    console.log('token: ', token)
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    jsonwebtoken.verify(token, SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: err });
        }
        req.user = user;
        console.log("verify token user: ", user)

        if (user.id == req.params.id) {
            next();
        } else {
            console.log("user id = ", user.id)
            console.log("req.params.id = ", req.params.id)
            return res.status(401).json({ error: 'user.id != req.params.id' })
        }
    });
}

// Define a route to handle user updates
authRouter.put('/users/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { password, name, age, gender } = req.body;

        // Validate request
        if (!name || !age || !gender) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        let user;

        await db.query('select * from users where id = ?', id, (err, rs) => {
            if (err) {
                return res.status(500).json({
                    message: ' Internal Server Error'
                })
            }

            user = rs[0]
            if (!user) {
                return res.status(200).json({
                    message: ' user not found '
                })
            }

            let hashedPwInput = hashPwWithGivenSalt(password, user.salt)
            if (hashedPwInput != user.password) {
                return res.status(403).json({ error: 'wrong password' });
            }
        })
        db.query('update users set name=?, age=?, gender=? where id = ?', [name, age, gender, id]
            , (err) => {
                if (err) {
                    return res.status(500).json({ message: ' Internal Server Error' })
                }

                const jwt = jsonwebtoken.sign({
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    age: user.age,
                    name: user.name,
                    gender: user.gender,
                    email: user.email
                }, SECRET, {
                    algorithm: 'HS256', // algorithm for hashing data in signature section => HS256(header + payload, SECRET)
                    expiresIn: '365d', // thoi gian sd jwt
                    issuer: 'sgroup' // nguoi cap phat jwt
                })

                return res.status(200).json({ message: jwt })
            })

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = authRouter