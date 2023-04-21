// refresh token access token

const jsonwebtoken = require('jsonwebtoken');
const SECRET = 'jasmine'
const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiIsInVzZXJuYW1lIjoiU2dyb3VwIiwiZW1haWwiOiJqb2huc2dyQGdtYWlsLmNvbSIsImFnZSI6MjQsImdlbmRlciI6Im1hbGUiLCJpYXQiOjE2ODE4MjY0MDEsImV4cCI6MTY4MTgyNjQwMiwiaXNzIjoic2dyb3VwIn0.du61TV3CVTjBMGbAlkncuhxvvdDQlUgZts3F-TPnbKo'
const receivedPayload = jsonwebtoken.verify(userToken, SECRET)

console.log(receivedPayload)