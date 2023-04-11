const express = require('express');
const fs = require('fs');
const userRouter = express.Router()


var users = [];

function getUsers() {
    let allUsersStr = fs.readFileSync('users.txt', 'utf8');
    allUsersStr.split('\n').forEach(line => {
        users.push(JSON.parse(line))
    })
    console.log(users)
}

function validateUser(req, res, next) {
    const regexSpecial = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/g
    const regexNumber = /^\d+$/

    if ((!regexSpecial.test(req.query.name)) && (regexNumber.test(req.query.age))) {
        next()
    } else {
        res.status(400).send('Invalid data');
    }

}

getUsers()

userRouter.get('/users', function (req, res) {
    console.log(users);
    res.json(users);
    res.status(200).send('Get users successfully')
    return;
})

userRouter.get('/users/:id', function (req, res) {
    let user = users.find(user => user.id === req.params.id);
    if (user != null) {
        console.log(user);
        res.json(user);
        res.status(200).send('Get user successfully')
    } else {
        console.log("user is not found");
        res.send("user is not found");
    }
    return;
})

userRouter.put('/users/:id', validateUser, function (req, res, next) {
    let user = users.find(user => user.id === req.params.id)
    if (user != null) {
        user.name = req.query.name
        user.gender = req.query.gender
        user.age = req.query.age
        console.log(user);
        res.json(user);
        let allUsersString = ""
        for (let user of users) {
            allUsersString += ("\n" + JSON.stringify(user))
        }
        fs.writeFileSync('users.txt', allUsersString)
    } else {
        console.log("user is not found");
        res.send("user is not found");
    }
    next()
})

userRouter.post('/users', validateUser, function (req, res, next) {
    const id = req.query.id;
    const name = req.query.name;
    const gender = req.query.gender;
    const age = req.query.age;

    users.push(req.query)
    console.log(req.query)
    // console.log(typeof req.query) //Object
    res.send(`Received user with parameters: id=${id}, name=${name}, gender=${gender}, age=${age}`);
    let userStr = fs.readFileSync('users.txt', 'utf8');
    let newUserStr = userStr + "\n" + JSON.stringify(req.query)
    fs.writeFileSync('users.txt', newUserStr);
    next();
})

userRouter.delete('/users/:id', function (req, res, next) {
    let user = users.find(u => u.id === req.query.id)
    users.splice(user, 1)
    console.log(users)
    let allUsersString = "";
    for (let user of users) {
        if (user == users[0]) {
            allUsersString += JSON.stringify(user)
        } else {
            allUsersString += ("\n" + JSON.stringify(user))
        }
    }
    fs.writeFileSync('users.txt', allUsersString)
    res.send(users)
    next()
})

module.exports = userRouter