const request = require('supertest');
const server = require('../server.js');
const db = require('../data/db-config');

const wipeDB = async () => { await db('users').truncate(); }

module.exports = () => {
    wipeDB();
    describe('POST /auth/register', () => {
        it('should return status 201 if registered', async () => {
            const res = await request(server).post('/api/auth/register')
            .send({
                email: "QHtestuser120391243124@gmail.com",
                username: "QHtestuser12039c1243124",	
                password: "testO023123#@#adSD",
                fullName: "quack test user"
            })
            console.log('abc res.status:', res.status);
            console.log('abc res.body:', res.body);
            expect(res.status).toBe(201);
            expect(res.type).toMatch(/json/i);
        })
    })
    describe('POST /auth/login', () => {
        it('should require authorization', async () => {
            const res = await request(server).get('/api/users/user');
            expect(res.status).toBe(400);
            expect(res.body).toEqual({message: 'No token was provided'})
        });
        it('should return status 200 and an object if authenticated', async () => {
            const auth = await request(server).post('/api/auth/login')
            .send({ username: "QHtestuser12039c1243124", password: "testO023123#@#adSD" });

            console.log('login auth body:', auth.body);
            expect(auth.status).toBe(200);
            expect(auth.type).toMatch(/json/i);
        })
    });
}