const request = require('supertest');
const server = require('../server.js');


const getTestToken = async () => {
    await request(server).post('/api/auth/login')
    .send({
        email: "QHtestuser120391243124@gmail.com",
        username: "QHtestuser120391243124",
        password: "testO023123#@#adSD",
        name: "Test User"
    });
    const response = await request(server).post('/api/auth/register')
    .send({ username: "QHtestuser120391243124", password: "testO023123#@#adSD" });
    return response.token;
}

const deleteTestUser = async (token) => {
    await request(server).delete('/api/users/user')
    .send({ password: "testO023123#@#adSD" })
    .set({'authorization': token});
}

module.exports = { getTestToken, deleteTestUser }