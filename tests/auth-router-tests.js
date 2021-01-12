const request = require('supertest');
const server = require('../server.js');

let token = '';
// case `/auth post /register 400`: status = 400; responseObj = { message: 'Email, username, password, and fullName are required.' }; break;
// case `/auth post /register 400-2`: status = 400; responseObj = { message: 'Username must only contain characters A-Z, _, and 0-9. Username must start with a letter.' }; break;
// case `/auth post /register 409`: status = 409; responseObj = { message: `Username '${req.username}' is already in use.` }; break;
// case `/auth post /register 409-2`: status = 409; responseObj = { message: `There is already an account associated with the email: ${req.email}` }; break;
// case `/auth post /login 400`: status = 400; responseObj = { message: 'Username and Password are required' }; break;
// case `/auth post /login 403`: status = 403; responseObj = { message: 'Invalid username or password' }; break;

module.exports = () => {
    describe('POST /auth/register', () => {
        it('should return status 201 if registered', async () => {
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
        it('should return status 200 and an object if authenticated', async () => {
            const res = await request(server).post('/api/auth/login')
            .send({ username: "QHtestuser12039c1243124", password: "testO023123#@#adSD" });
            expect(res.status).toBe(200);
            expect(res.type).toMatch(/json/i);
            token = res.body.token;
        })
    });
    describe('authenticate-middleware.js', () => {
        it('should require authorization', async () => {
            const res = await request(server).get('/api/users/user');
            expect(res.status).toBe(400);
            expect(res.body).toEqual({message: 'No token was provided'})
        });
        it('should reject invalid tokens', async () => {
            const res = await request(server).get('/api/users/user').set({'authorization': 'hi'});
            expect(res.status).toBe(401);
            expect(res.body.message).toEqual('Invalid token')
        });
        it('should authenticate valid tokens', async () => {
            const res = await request(server).get('/api/users/user').set({'authorization': token});
            expect(res.status).toBe(200);
        });
    })
}