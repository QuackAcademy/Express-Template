const request = require('supertest');
const server = require('../server.js');

let testUserID = '';
let token = '';
const createTestUser = async () => {
    await request(server).post('/api/auth/register').send({ email: 'quackquack@gmail.com', username: "QHtestuser", password: "testO023123#@#adSD", fullName: 'testerson' });
    const loginResponse = await request(server).post('/api/auth/login').send({ username: "QHtestuser", password: "testO023123#@#adSD", });
    testUserID = loginResponse.body.user?.id;
    token = loginResponse.body.token;
}

module.exports = () => {
    createTestUser();
    
    //#region users router
        // case `/users get /user 404`: status = 404; responseObj = { message: `User with id ${req.user.id} not found` }; break;
        // case `/users get /:id 400`: status = 400; responseObj = { message: `Param id must be a number. Received: ${req.params.id}` }; break;
        // case `/users get /:id 404`: status = 404; responseObj = { message: `User with id ${req.user.id} not found` }; break;
        // case `/users put /user 400`: status = 400; responseObj = { message: `Current password is required` }; break;
        // case `/users put /user 400-2`: status = 400; responseObj = { message: `Username must only contain characters A-Z, _, and 0-9. Username must start with a letter` }; break;
        // case `/users put /user 403`: status = 403; responseObj = { message: `Invalid credentials` }; break;
        // case `/users put /user 404`: status = 404; responseObj = { message: `User not found` }; break;
        // case `/users put /user 409`: status = 409; responseObj = { message: `Username '${req.username}' is already in use` }; break;
        // case `/users put /user 409-2`: status = 409; responseObj = { message: `Email '${req.email}' is already in use` }; break;
        // case `/users delete /user 400`: status = 400; responseObj = { message: 'Password is required to delete user' }; break;
        // case `/users delete /user 403`: status = 403; responseObj = { message: 'Invalid credentials' }; break;
    //#endregion

    
    // console.log(`res.status: ${res.status}, message: ${res.body.message}`)
    // console.log(`res.status: ${res.status}, body: `, res.body)

    it('Should require authorization', async () => {
        const res = await request(server).get(`/api/users/${testUserID}`);
        expect(res.status).toBe(400);
        expect(res.body.message).toEqual('No token was provided');
    });

    describe('GET /users/:id', () => {
        it('Should return status 200 and correct data for a valid request', async () => {
            const res = await request(server).get(`/api/users/${testUserID}`).set({'authorization': token});
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ id: testUserID, email: 'quackquack@gmail.com', username: "qhtestuser", password: null, fullName: 'testerson' });
        });
        it(`Should not include user's password in response`, async () => {
            const res = await request(server).get(`/api/users/${testUserID}`).set({'authorization': token});
            expect(res.status).toBe(200);
            expect(res.body.password).toBe(null);
        });
        it('Should only accept numbers as a param', async () => {
            const res = await request(server).get(`/api/users/hello`).set({'authorization': token});
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual('Param id must be a number. Received: hello');
        });
        it('Should return 404 if user not found', async () => {
            const res = await request(server).get(`/api/users/404045034530495345`).set({'authorization': token});
            expect(res.status).toBe(404);
            expect(res.body.message).toEqual('User with id 404045034530495345 not found');
        });
    });
}