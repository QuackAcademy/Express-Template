const request = require('supertest');
const server = require('../server.js');

let token = '';

module.exports = () => {
    describe('POST /auth/register', () => {
        it('Should return status 201 if registered', async () => {
            const res = await request(server).post('/api/auth/register')
            .send({ email: "QHtestuser120391243124@gmail.com", username: "QHtestuser12039c1243124", password: "testO023123#@#adSD", fullName: "quack test user" })
            expect(res.status).toBe(201);
            expect(res.type).toMatch(/json/i);
            expect(res.body.message).toContain('Successfully added user #')
        })
        it('Should return status 400 for bad requests', async () => {
            const missingEmail = await request(server).post('/api/auth/register')
            .send({ username: "QHtestuser12039c1243124", password: "testO023123#@#adSD", fullName: "quack test user" })
            expect(missingEmail.status).toBe(400);
            expect(missingEmail.body.message).toBe('Email, username, password, and fullName are required.')

            const missingUsername = await request(server).post('/api/auth/register')
            .send({ email: "QHtestuser120391243124@gmail.com", password: "testO023123#@#adSD", fullName: "quack test user" })
            expect(missingUsername.status).toBe(400);
            expect(missingUsername.body.message).toBe('Email, username, password, and fullName are required.')
            
            const missingPassword = await request(server).post('/api/auth/register')
            .send({ email: "QHtestuser120391243124@gmail.com", username: "QHtestuser12039c1243124", fullName: "quack test user" })
            expect(missingPassword.status).toBe(400);
            expect(missingPassword.body.message).toBe('Email, username, password, and fullName are required.')
            
            const missingName = await request(server).post('/api/auth/register')
            .send({ email: "QHtestuser120391243124@gmail.com", username: "QHtestuser12039c1243124", password: "testO023123#@#adSD" })
            expect(missingName.status).toBe(400);
            expect(missingName.body.message).toBe('Email, username, password, and fullName are required.')
            
            const missingAll = await request(server).post('/api/auth/register')
            expect(missingAll.status).toBe(400);
            expect(missingAll.body.message).toBe('Email, username, password, and fullName are required.')
        })
        it('Should return status 400 and reject invalid usernames', async () => {
            const invalidCharacters = await request(server).post('/api/auth/register')
            .send({ email: "QHtestuser120391243124@gmail.com", username: "QHtestuse@@@@@r12039c1243124", password: "testO023123#@#adSD", fullName: "quack test user" })
            expect(invalidCharacters.status).toBe(400);
            expect(invalidCharacters.body.message).toBe('Username must only contain characters A-Z, _, and 0-9. Username must start with a letter.')

            const numberFirst = await request(server).post('/api/auth/register')
            .send({ email: "QHtestuser120391243124@gmail.com", username: "1QHtestuser12039c1243124", password: "testO023123#@#adSD", fullName: "quack test user" })
            expect(numberFirst.status).toBe(400);
            expect(numberFirst.body.message).toBe('Username must only contain characters A-Z, _, and 0-9. Username must start with a letter.')
        })
        it('Should return status 409 for conflicts', async () => {
            const usernameInUse = await request(server).post('/api/auth/register')
            .send({ email: "dajlsdasdh@gmail.com", username: "QHtestuser12039c1243124",	password: "testO023123#@#adSD", fullName: "quack test user" })
            expect(usernameInUse.status).toBe(409);
            expect(usernameInUse.body.message).toBe(`Username 'QHtestuser12039c1243124' is already in use.`)
            const emailInUse = await request(server).post('/api/auth/register')
            .send({ email: "QHtestuser120391243124@gmail.com", username: "QHtestuser123", password: "testO023123#@#adSD", fullName: "quack test user" })
            expect(emailInUse.status).toBe(409);
            expect(emailInUse.body.message).toBe('There is already an account associated with the email: QHtestuser120391243124@gmail.com')
        })
    })
    describe('POST /auth/login', () => {
        it('Should return status 400 for bad requests', async () => {
            const missingPasswordRes = await request(server).post('/api/auth/login')
            .send({ username: "QHtestuser12039c1243124" });
            expect(missingPasswordRes.status).toBe(400);
            expect(missingPasswordRes.body.message).toEqual('Username and Password are required')

            const missingUsernameRes = await request(server).post('/api/auth/login')
            .send({ password: "testO023123#@#adSD" });
            expect(missingUsernameRes.status).toBe(400);
            expect(missingUsernameRes.body.message).toEqual('Username and Password are required')

            const missingBothRes = await request(server).post('/api/auth/login')
            expect(missingBothRes.status).toBe(400);
            expect(missingBothRes.body.message).toEqual('Username and Password are required')
        })
        it('Should return status 403 for proper requests that do not match a valid login', async () => {
            const badPasswordRes = await request(server).post('/api/auth/login')
            .send({ username: "QHtestuser12039c1243124", password: "testO0231dSD" });
            expect(badPasswordRes.status).toBe(403);
            expect(badPasswordRes.body.message).toEqual('Invalid username or password')

            const badUsernameRes = await request(server).post('/api/auth/login')
            .send({ username: "QHtestuser12039", password: "testO023123#@#adSD" });
            expect(badUsernameRes.status).toBe(403);
            expect(badUsernameRes.body.message).toEqual('Invalid username or password')
        })
        it('Should return status 200 and an object if authenticated', async () => {
            const res = await request(server).post('/api/auth/login')
            .send({ username: "QHtestuser12039c1243124", password: "testO023123#@#adSD" });
            expect(res.status).toBe(200);
            expect(res.type).toMatch(/json/i);
            token = res.body.token;
        })
    });
    describe('authenticate-middleware.js', () => {
        it('Should require authorization', async () => {
            const res = await request(server).get('/api/users/user');
            expect(res.status).toBe(400);
            expect(res.body).toEqual({message: 'No token was provided'})
        });
        it('Should reject invalid tokens', async () => {
            const res = await request(server).get('/api/users/user').set({'authorization': 'hi'});
            expect(res.status).toBe(401);
            expect(res.body.message).toEqual('Invalid token')
        });
        it('Should authenticate valid tokens', async () => {
            const res = await request(server).get('/api/users/user').set({'authorization': token});
            expect(res.status).toBe(200);
        });
    })
}