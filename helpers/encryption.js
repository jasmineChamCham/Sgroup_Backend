const crypto = require('crypto')

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048
})

function encryptWithPublicKey(data) {
    return crypto.publicEncrypt(
        {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        // We convert the data string to a buffer using `Buffer.from`
        Buffer.from(data)
    );
}

function decryptWithPrivateKey(encryptedData) {
    const decryptedData = crypto.privateDecrypt(
        {
            key: privateKey,
            // In order to decrypt the data, we need to specify the
            // same hashing function and padding scheme that we used to
            // encrypt the data in the previous step
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        encryptedData
    );
}

module.exports = { encryptWithPublicKey, decryptWithPrivateKey }
