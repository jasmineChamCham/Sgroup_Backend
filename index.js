const express = require('express');
const app = express();
const port = 3000;
const userRouter = require('./routes/users.js')
const loginRouter = require('./routes/login.js')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', userRouter)
app.use('/', loginRouter)

app.listen(port, function () {
    console.log(`listening on port ${port}`);
})


