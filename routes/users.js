const express = require('express');
const connection = require('../database/connection')
const fs = require('fs');
const userRouter = express.Router()

function validateUser(req, res, next) {
    // const regexSpecial = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/g
    // const regexNumber = /^\d+(\.\d+)?$/

    // if ((!regexSpecial.test(req.query.name)) && (regexNumber.test(req.query.age))) {
    //     next()
    // } else {
    //     res.status(400).send('Invalid data');
    // }

    const regexSpecial = /^[a-zA-Z0-9]+$/;
    const regexNumber = /^\d+(\.\d+)?$/;

    if (regexSpecial.test(req.query.name) && regexNumber.test(req.query.age)) {
        next();
    } else {
        res.status(400).send('Invalid data');
    }

}


userRouter.get('/users', function (req, res) {
    connection.query('select * from user', (err, rs) => {
        if (err) {
            res.send('Error connection')
            return
        }
        let allUsers = rs;
        res.status(200).json(allUsers)
    })
    return;
})

userRouter.get('/users/:id', function (req, res) {
    connection.query('select * from user where id = ?', [req.params.id], (err, rs) => {
        if (err) {
            console.error(err);
            res.send('Error connection')
            return
        }
        if (Object.keys(rs).length != 0) {
            console.log(rs);
            res.status(200).json(rs);
        } else {
            console.log("user is not found");
            res.send("User is not found");
        }
        return
    })
})

userRouter.put('/users/:id', validateUser, function (req, res) {
    console.log(req.query.name, req.query.gender, req.query.age, req.params.id)
    connection.query('update `user` set name = ?, gender=?, age=? where id = ?',
        [req.query.name, req.query.gender, req.query.age, req.params.id],
        (err, rs) => {
            if (err) {
                console.error(err)
                res.send('Error connection')
                return
            }
            connection.query('select * from user', (err, rs) => {
                if (err) {
                    res.send('Error connection')
                    return
                }
                let allUsers = rs;
                res.status(200).json(allUsers)
            })
        })
    return
})

userRouter.post('/users', validateUser, function (req, res) {
    const name = req.query.name;
    const gender = req.query.gender;
    const age = req.query.age;

    connection.query('insert into User(name, gender, age) values(?, ?, ?)', [name, gender, age],
        (err, rs) => {
            if (err) {
                console.error(err);
                res.send('Error connection')
                return
            }

            connection.query('select * from user', (err, rs) => {
                if (err) {
                    res.send('Error connection')
                    return
                }
                let allUsers = rs;
                res.status(200).json(allUsers)
            })
        })

    return
})

userRouter.delete('/users/:id', function (req, res) {
    connection.query('delete from User where id = ?', [req.params.id],
        (err, rs) => {
            if (err) {
                res.send('Error connection')
                return
            }

            connection.query('select * from user', (err, rs) => {
                if (err) {
                    res.send('Error connection')
                    return
                }
                let allUsers = rs;
                res.status(200).json(allUsers)
            })
        })


    return
})

module.exports = userRouter