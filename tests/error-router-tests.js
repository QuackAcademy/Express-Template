const request = require('supertest');
const server = require('../server.js');

let token = '';
const createTestUser = async () => {
    // await request(server).post('/api/auth/register').send({ email: 'quackquack@gmail.com', username: "QHtestuser", password: "testO023123#@#adSD", fullName: 'testerson' });
    const loginResponse = await request(server).post('/api/auth/login').send({ username: "QHtestuser", password: "testO023123#@#adSD", });
    testUserID = loginResponse.body.user?.id;
    token = loginResponse.body.token;
}

module.exports = () => {
    createTestUser();

    it('Should require authorization', async () => {
        const res = await request(server).post(`/api/error/getByQuery`);
        expect(res.status).toBe(400);
        expect(res.body.message).toEqual('No token was provided');
    });
    describe('POST /errors/getByQuery', () => {
        // it('Should return status 201 if registered', async () => {
        //     const res = await request(server).post('/api/auth/register')
        //     .send({ email: "QHtestuser120391243124@gmail.com", username: "QHtestuser12039c1243124", password: "testO023123#@#adSD", fullName: "quack test user" })
        //     expect(res.status).toBe(201);
        //     expect(res.type).toMatch(/json/i);
        //     expect(res.body.message).toContain('Successfully added user #')
        // })
    })
}