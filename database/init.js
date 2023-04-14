const connection = require('./connection')

connection.query(
    `create table User(
	id int primary key AUTO_INCREMENT,
    name varchar(50) not null,
    gender bool default true,
    age int 
    )`, (err, rs) => {
    if (err) {
        console.log("error: ", err)
    }
    if (rs) {
        console.log("rs: ", rs)
    }
})

function addUser(name, gender, age) {
    connection.query(
        `insert into User(name, gender, age) values(?, ?, ?)`, [name, gender, age],
        (err, rs) => {
            if (err) {
                console.log("error: ", err)
            }
            if (rs) {
                console.log("rs: ", rs)
            }
        }
    )
}

// addUser('Billy', true, 21)
// addUser('Martin', true, 15)
// addUser('Jasmine', false, 18)