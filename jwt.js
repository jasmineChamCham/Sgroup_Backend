const jsonwebtoken = require('jsonwebtoken');

const SECRET = 'jasmine'

const user = {
    name: 'John',
    username: 'Sgroup',
    password: ' sgr12345',
    email: 'johnsgr@gmail.com',
    age: 24,
    balance: '500000',
    gender: 'male'
}

const jwt = jsonwebtoken.sign({
    name: user.name,
    username: user.username,
    email: user.email,
    age: user.age,
    gender: user.gender
}, SECRET, {
    algorithm: 'HS256', // algorithm for hashing data in signature section => HS256(header + payload, SECRET)
    expiresIn: '1s', // thoi gian sd jwt
    issuer: 'sgroup' // nguoi cap phat jwt
})

console.log(jwt)


