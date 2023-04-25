const connection = require('./connection')

// connection.query(
//     `create table User(
// 	id int primary key AUTO_INCREMENT,
//     name varchar(50) not null,
//     gender bool default true,
//     age int
//     )`, (err, rs) => {
//     if (err) {
//         console.log("error: ", err)
//     }
//     if (rs) {
//         console.log("rs: ", rs)
//     }
// })

// function addUser(name, gender, age) {
//     connection.query(
//         `insert into User(name, gender, age) values(?, ?, ?)`, [name, gender, age],
//         (err, rs) => {
//             if (err) {
//                 console.log("error: ", err)
//             }
//             if (rs) {
//                 console.log("rs: ", rs)
//             }
//         }
//     )
// }

// addUser('Billy', true, 21)
// addUser('Martin', true, 15)
// addUser('Jasmine', false, 18)

// connection.query(
//     `create table Student(
// 	id int primary key AUTO_INCREMENT,
//     name varchar(50) not null
//     )`, (err, rs) => {
//     if (err) {
//         console.log("error: ", err)
//     }
//     if (rs) {
//         console.log("rs: ", rs)
//     }
// })

// connection.query(
//     `create table course(
// 	id int primary key AUTO_INCREMENT,
//     name varchar(50) not null
//     )`, (err, rs) => {
//     if (err) {
//         console.log("error: ", err)
//     }
//     if (rs) {
//         console.log("rs: ", rs)
//     }
// })


// connection.query(
//     `create table Register(
//         student_id int,
//         course_id int,
//         register_date date,
//         constraint FK_Register_Student FOREIGN KEY(student_id) references Student(id),
//         constraint FK_Register_Course FOREIGN KEY(course_id) references Course(id),
//         Primary Key(student_id, course_id)
//     )`, (err, rs) => {
//     if (err) {
//         console.log("error: ", err)
//     }
//     if (rs) {
//         console.log("rs: ", rs)
//     }
// })


