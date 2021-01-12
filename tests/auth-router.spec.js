const request = require('supertest');
const server = require('../server.js');
const db = require('../data/db-config');
const { deleteTestUser } = require('./testUtils.js');

    
describe('auth router', () => {
    describe('POST /auth/register', () => {
        it('should return status 201 if registered', async () => {
            const res = await request(server).post('/api/auth/register')
            .send({
                email: "quack-test-user434234@gmail.com",
                username: "quack-test-user434234",	
                password: "adksSjdasfl4234234!@!2",
                fullName: "quack test user"
            });
            console.log(res.body);
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
            .send({
                username: 'quack-test-user434234',
                password: 'adksSjdasfl4234234!@!2'
            });
            console.log(auth.body);
            expect(auth.status).toBe(200);
            expect(auth.type).toMatch(/json/i);
        })
    });
    deleteTestUser();
});