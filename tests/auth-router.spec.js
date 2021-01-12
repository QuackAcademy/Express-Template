const request = require('supertest');
const server = require('../server.js');
const db = require('../data/db-config');

const getTestToken = async () => {
    await request(server).post('/api/auth/register')
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


describe('auth router', async () => {
    describe('the server', () => {
        describe('GET /', () => {
            it('it should return status 200', async () => {
                const res = await request(server).get('/');
                expect(res.status).toBe(200);
            });
            it('it should return the correct object', async () => {
                const res = await request(server).get('/');
                expect(res.type).toBe('application/json');
                expect(res.body).toEqual({message: 'hi'});
            });
            
        });
    });
    describe('POST /auth/register', () => {
        it('should return status 201 if registered', async () => {
            // await deleteTestUser(await getTestToken());
            const res = await request(server).post('/api/auth/register')
            .send({
                email: "QHtestuser120391243124@gmail.com",
                username: "QHtestuser12039c1243124",	
                password: "testO023123#@#adSD",
                fullName: "quack test user"
            })
            // .set({'Content-Type': 'application/json'})
            // .set({'authorization': 'wtf'})
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
    // deleteTestUser(getTestToken());
});