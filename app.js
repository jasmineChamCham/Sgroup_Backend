const jsonwebtoken = require('jsonwebtoken')
const express = require('express')
require('dotenv').config({ path: '.env' })
const app = express()
const SECRET = process.env.SECRET
const crypto = require('crypto')

const {
    publicKey,
    privateKey,
} = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 })

// encrypt data with public key
function encrypt(plainText) {

    const encrypted = crypto.publicEncrypt(
        {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        Buffer.from(plainText)
    )

    // Return: Base64 encoded encrypted text
    return encrypted.toString("base64");
}

// decrypt data with private key
function decrypt(cipherText) {
    const plainText = crypto.privateDecrypt({
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
    },
        Buffer.from(cipherText, 'base64'))
    return plainText.toString()
}


const db = [
    {
        username: 'jasmine',
        age: 22,
        email: 'jasmine@gmail.com',
        password: encrypt('jasmine123'),
        balance: 99999999
    },

    {
        username: 'tram',
        age: 20,
        email: 'tram@gmail.com',
        password: encrypt('tramqwe'),
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
            algorithm: 'RS256',
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