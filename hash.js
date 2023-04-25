const crypto = require('crypto')

function hashPw(input) {
    const hashObj = crypto.createHash('sha512')
    const hashedPassword = hashObj.update(input).digest('hex')
    return hashedPassword
}

const plainPassword = 'tram123'
const hashedPassword = hashPw(plainPassword)
const hashedPassword2 = hashPw(plainPassword)
console.log(hashedPassword, '\n', hashedPassword2) // hashedPassword = hashedPassword2


