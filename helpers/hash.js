const crypto = require('crypto')

function hashPw(plainPassword) {
    // generate salt
    const salt = crypto.randomBytes(16).toString('hex')
    const hashedPassword = crypto.pbkdf2Sync(plainPassword, salt, 1000, 64, 'sha512').toString('hex')

    return {
        salt,
        hashedPassword
    }
}

function hashPwWithGivenSalt(plainPassword, salt) {
    const hashedPassword = crypto.pbkdf2Sync(plainPassword, salt, 1000, 64, 'sha512').toString('hex')
    return hashedPassword
}

module.exports = { hashPw, hashPwWithGivenSalt }
