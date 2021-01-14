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
    describe('GET /users/user', () => {
        it('Should return status 200 and correct data for a valid request', async () => {
            const res = await request(server).get('/api/users/user').set({'authorization': token});
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ id: testUserID, email: 'quackquack@gmail.com', username: "qhtestuser", password: null, fullName: 'testerson' });
        })
        it("Should return status 404 if token user isn't found", async () => {
            // I'll have to test this by providing a valid (can be decoded with secret and has proper values) token of a deleted user
            const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0Ijo2LCJpYXQiOjE2MTA2MTU4NjMsImV4cCI6MTYxMTY5NTg2M30.W33UfE8AUdI5AoIMXk-NsuJfn_UxAbxm_1OuoUkXINE';
            const res = await request(server).get('/api/users/user').set({'authorization': invalidToken});
            expect(res.status).toBe(404);
            expect(res.body.message).toEqual('User with id 6 not found');
        })
        it(`Should not include user's password in response`, async () => {
            const res = await request(server).get('/api/users/user').set({'authorization': token});
            expect(res.status).toBe(200);
            expect(res.body.password).toBe(null);
        });
    });
    describe('GET /users/all', () => {
        it('Should return status 200 and correct data for a valid request', async () => {
            const res = await request(server).get('/api/users/user/all').set({'authorization': token});
            expect(res.status).toBe(200);
            expect(res.body).toEqual([
                {"email": "quackquack@gmail.com", "fullName": "testerson", "id": 1, "username": "qhtestuser"}, 
                {"email": "qhtestuser120391243124@gmail.com", "fullName": "quack test user", "id": 2, "username": "qhtestuser12039c1243124"} 
            ]);
        })
    });
    describe('PUT /users/user', () => {
        it('Should return status 400 if password is missing', async () => {
            const res = await request(server).put('/api/users/user')
            .send({ email: 'fdhfsdfsd@gmail.com' }).set({'authorization': token})
            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Current password is required')
        })
        it('Should return status 400 if nothing was provided to update', async () => {
            const res = await request(server).put('/api/users/user')
            .send({ password: 'testO023123#@#adSD' }).set({'authorization': token})
            expect(res.status).toBe(400);
            expect(res.body.message).toBe('No new values were sent')
        })
        it('Should return status 400 and reject invalid usernames', async () => {
            const invalidCharacters = await request(server).put('/api/users/user')
            .send({ username: "QHtestuse@@@@@r12039c1243124", password: "testO023123#@#adSD" }).set({'authorization': token})
            expect(invalidCharacters.status).toBe(400);
            expect(invalidCharacters.body.message).toBe('Username must only contain characters A-Z, _, and 0-9. Username must start with a letter')

            const numberFirst = await request(server).put('/api/users/user')
            .send({ username: "1QHtestuser12039c1243124", password: "testO023123#@#adSD" }).set({'authorization': token})
            expect(numberFirst.status).toBe(400);
            expect(numberFirst.body.message).toBe('Username must only contain characters A-Z, _, and 0-9. Username must start with a letter')
        })
        it('Should return status 403 if password is incorrect', async () => {
            const res = await request(server).put('/api/users/user')
            .send({ password: 'notyourpassword', fullName: 'name changed' }).set({'authorization': token});
            expect(res.status).toBe(403);
            expect(res.body.message).toBe('Invalid credentials')
        })
        it("Should return status 404 if token user isn't found", async () => {
            // I'll have to test this by providing a valid (can be decoded with secret and has proper values) token of a deleted user
            const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0Ijo2LCJpYXQiOjE2MTA2MTU4NjMsImV4cCI6MTYxMTY5NTg2M30.W33UfE8AUdI5AoIMXk-NsuJfn_UxAbxm_1OuoUkXINE';
            const res = await request(server).put('/api/users/user')
            .send({ password: 'notyourpassword', fullName: 'name changed' }).set({'authorization': invalidToken});
            expect(res.status).toBe(404);
            expect(res.body.message).toBe('User not found')
        })
        it('Should return status 409 for conflicts', async () => {
            const usernameInUse = await request(server).put('/api/users/user')
            .send({ email: 'quackquack222@gmail.com', username: "QHtestuser",	password: "testO023123#@#adSD", fullName: "quack test user" })
            .set({'authorization': token})
            expect(usernameInUse.status).toBe(409);
            expect(usernameInUse.body.message).toBe(`Username 'QHtestuser' is already in use`)
            const emailInUse = await request(server).put('/api/users/user')
            .send({ email: 'quackquack@gmail.com', username: "QHtestuser222", password: "testO023123#@#adSD", fullName: "quack test user" })
            .set({'authorization': token})
            expect(emailInUse.status).toBe(409);
            expect(emailInUse.body.message).toBe(`Email 'quackquack@gmail.com' is already in use`)
        })
        it('Should return status 200 and return new values if user was updated', async () => {
            const res = await request(server).put('/api/users/user')
            .send({ email: 'quackquack2@gmail.com', username: "QHtestuser2", password: "testO023123#@#adSD", newPassword: '2testO023123#@#adSD', fullName: 'testerson2' })
            .set({'authorization': token})
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ id: testUserID, email: 'quackquack2@gmail.com', username: "qhtestuser2", fullName: 'testerson2' });
        })
        it('Should have updated password after last test', async () => {
            const loginResponse = await request(server).post('/api/auth/login')
            .send({ username: "QHtestuser2", password: "2testO023123#@#adSD", });
            expect(loginResponse.status).toBe(200);
        })
    });
    describe('DELETE /users/user', () => {
        it('Should return status 403 if password is incorrect', async () => {
            const res = await request(server).delete('/api/users/user')
            .send({ password: 'notyourpassword' }).set({'authorization': token});
            expect(res.status).toBe(403);
            expect(res.body.message).toBe('Invalid credentials')
        })
        it('Should return status 200 if user was deleted', async () => {
            const res = await request(server).delete('/api/users/user')
            .send({ password: '2testO023123#@#adSD' }).set({'authorization': token});
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('User successfully deleted')
        })
        it('Should gave deleted user and return status 404 when trying to delete again', async () => {
            const res = await request(server).delete('/api/users/user')
            .send({ password: '2testO023123#@#adSD' }).set({'authorization': token});
            expect(res.status).toBe(404);
            expect(res.body.message).toBe('User not found')
        })
    });
}