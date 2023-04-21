const mysql = require('mysql');
require('dotenv').config({ path: '.env' })

console.log(process.env.DB_HOST)
console.log(process.env.DB_USER)
console.log(process.env.DB_PW)
console.log(process.env.DB_NAME)


const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME
})

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack)
        return
    }
    console.log('Connected to database.')
});

module.exports = connection