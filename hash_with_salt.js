const crypto = require('crypto')

const plainPassword = 'tram123'

function hashWithSalt(pw) {
    // Generate random salt
    const salt = crypto.randomBytes(16).toString('hex')
    // hash password with salt
    const hashedPassword = crypto
        .pbkdf2Sync(pw, salt, 1000, 64, 'sha512')
        .toString('hex')
    return hashedPassword

}
hashWithSalt(plainPassword)