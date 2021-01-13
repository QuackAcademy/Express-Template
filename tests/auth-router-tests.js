const request = require('supertest');
const server = require('../server.js');

let token = '';
// case `/auth post /register 400`: status = 400; responseObj = { message: 'Email, username, password, and fullName are required.' }; break;
// case `/auth post /register 400-2`: status = 400; responseObj = { message: 'Username must only contain characters A-Z, _, and 0-9. Username must start with a letter.' }; break;
// case `/auth post /register 409`: status = 409; responseObj = { message: `Username '${req.username}' is already in use.` }; break;
// case `/auth post /register 409-2`: status = 409; responseObj = { message: `There is already an account associated with the email: ${req.email}` }; break;

module.exports = () => {
    describe('POST /auth/register', () => {
        it('Should return status 201 if registered', async () => {
            const res = await request(server).post('/api/auth/register')
            .send({
                email: "QHtestuser120391243124@gmail.com",
                username: "QHtestuser12039c1243124",	
                password: "testO023123#@#adSD",
                fullName: "quack test user"
            })
            // console.log('abc res.status:', res.status);
            // console.log('abc res.body:', res.body);
            expect(res.status).toBe(201);
            expect(res.type).toMatch(/json/i);
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