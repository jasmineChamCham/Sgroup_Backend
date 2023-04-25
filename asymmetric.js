const crypto = require('crypto')

const {
    publicKey,
    privateKey,
} = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 })

// encrypt data with public key
function encrypt(plainText) {

    const encrypted = crypto.publicEncrypt(
        {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        Buffer.from(plainText)
    )

    // Return: Base64 encoded encrypted text
    return encrypted.toString("base64");
}

// decrypt data with private key
function decrypt(cipherText) {
    const plainText = crypto.privateDecrypt({
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
    },
        Buffer.from(cipherText, 'base64'))
    return plainText.toString()
}

console.log({
    plainText: 'Ngoc tram',
    cipherText: encrypt('Ngoc tram'),
    decryptText: decrypt(encrypt('Ngoc tram'))
})