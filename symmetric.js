// symmetric use 1 SECRET KEY
// quy luat encrypt :
// 1, append secret key vao cuoi chuoi
// 2, dao nguoc chuoi
const SECRET = 'JASMINE'

function reverseString(str) {
    let splitStr = str.split('')
    splitStr = splitStr.reverse()
    return splitStr.join('')
}

function encrypt(input) {
    const inputWithPadding = input + SECRET
    const reverseStr = reverseString(inputWithPadding)
    return reverseStr
}

function decrypt(input) {
    // reverse string
    const reverseStr = reverseString(input)
    // remove padding (secret key)
    const output = reverseStr.substr(0, reverseStr.length - SECRET.length)
    return output
}

const plainText = 'NgocTram'
const cypherText = encrypt(plainText)
const decryptedText = decrypt(cypherText)

console.log(plainText, cypherText, decryptedText)