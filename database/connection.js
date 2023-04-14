const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Ngoctram123',
    database: 'user-management'
})

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack)
        return
    }
    console.log('Connected to database.')
});

module.exports = connection