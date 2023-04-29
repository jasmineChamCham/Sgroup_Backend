const express = require('express')
require('dotenv').config({ path: '.env' })
const jsonwebtoken = require('jsonwebtoken')
const db = require('../database/connection')
const { hashPw, hashPwWithGivenSalt } = require('../helpers/hash')
const authRouter = express.Router()
const SECRET = process.env.SECRET

app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

function validateRegisterRequest(req, res, next) {
    const { username, password, confirm_password, name, age, gender, email } = req.body
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    const unsignedNumberRegex = /^\d+$/
    if (password !== confirm_password) {
        return res.json({ message: 'password and confirm_password dont match' })
    }

    if (username.length < 3) {
        return res.json({ message: 'username str length must be greater or equal to 3' })
    }

    if (password.length < 3) {
        return res.json({ message: 'password str length must be greater or equal to 3' })
    }

    if (!emailRegex.test(email)) {
        return res.json({ message: 'wrong email' })
    }

    if (name.length < 2) {
        return res.json({ message: 'name str length must be greater or equal to 2' })
    }

    if (!gender) {
        return res.json({ message: 'no input for gender' })
    }

    if (!unsignedNumberRegex.test(age)) {
        return res.json({ message: 'age must me unsigned number' })
    }
    next()
}

authRouter.post('/register', validateRegisterRequest, (req, res) => {
    const { username, password, confirm_password, name, age, gender, email } = req.body

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
            return res.status(403).json({ eror: err });
        }

        if (user.id == req.params.id) {
            console.log("verify token user: ", user)
            next();
        } else {
            console.log("user id = ", user.id)
            console.log("req.params.id = ", req.params.id)
            return res.status(401).json({ error: 'user.id != req.params.id' })
        }
    });
}

function validateUpdateRequest(req, res, next) {
    const { password, name, age, gender } = req.body;

    if (!name) {
        console.log("name: " + name)
        return res.status(400).json({ error: 'Missing name field' });
    }
    if (!age) {
        console.log("age: " + age)
        return res.status(400).json({ error: 'Missing age field' });
    }

    const unsignedNumberRegex = /^\d+$/

    if (!unsignedNumberRegex.test(age)) {
        return res.json({ message: 'age must be unsigned number' })
    }

    next()

}

authRouter.put('/users/:id', verifyToken, validateUpdateRequest, async (req, res) => {
    try {
        const { id } = req.params;
        const { password, name, age, gender } = req.body;

        let user;

        await db.query('select * from users where id = ?', id, (err, rs) => {
            if (err) {
                return res.status(500).json({
                    message: "hehe " + err
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
                    return res.status(500).json({ message: ' hihi ' + err })
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