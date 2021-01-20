const request = require('supertest');
const server = require('../server.js');

let token = '';
const createTestUser = async () => {
    await request(server).post('/api/auth/register').send({ email: 'quackquackerror@gmail.com', username: "QHtestuserError", password: "testO023123#@#adSD", fullName: 'testerson' });
    const loginResponse = await request(server).post('/api/auth/login').send({ username: "QHtestuserError", password: "testO023123#@#adSD", });
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

    // case `/errors post /getByQuery 400-3`: status = 400; responseObj = { message: 'userID must be null or a number' }; break;
    // case `/errors post /getByQuery 404`: status = 404; responseObj = { message: 'No errors found' }; break;
    // case `/errors delete /deleteByQuery 400`: status = 400; responseObj = { message: 'Protected endpoint, password is required' }; break;
    // case `/errors delete /deleteByQuery 400-2`: status = 400; responseObj = { message: 'userID must be null or a number' }; break;
    // case `/errors delete /deleteByQuery 400-3`: status = 400; responseObj = { message: 'deleteAll must be true if trying to delete everything. Otherwise, provide query vars.' }; break;
    // case `/errors delete /deleteByQuery 403`: status = 403; responseObj = { message: 'Invalid Password, access denied' }; break;
    // case `/errors delete /deleteByQuery 404`: status = 404; responseObj = { message: 'No errors found' }; break;
    describe('POST /errors/getByQuery', () => {
        it('Should return status 400 if password is missing', async () => {
            const res = await request(server).post(`/api/error/getByQuery`)
            .set({'authorization': token});
            expect(res.status).toBe(400);
            expect(res.body.message).toContain('Protected endpoint, password is required')
        })
        it('Should return status 400 if sortType has an invalid value', async () => {
            const res = await request(server).post(`/api/error/getByQuery`)
            .send({ password: 'quackquack', sortType: 'fish' }).set({'authorization': token});
            expect(res.status).toBe(400);
            expect(res.body.message).toContain('sortType can only be set to null, asc, or desc')
        })
        it('Should return status 400 if userID has an invalid value', async () => {
            const res = await request(server).post(`/api/error/getByQuery`)
            .send({ password: 'quackquack', userID: 'fish' }).set({'authorization': token});
            expect(res.status).toBe(400);
            expect(res.body.message).toContain('userID must be null or a number')
        })
        it('Should return status 403 if password incorrect', async () => {
            const res = await request(server).post(`/api/error/getByQuery`)
            .send({ password: 'wrong password' }).set({'authorization': token});
            expect(res.status).toBe(403);
            expect(res.body.message).toContain('Invalid Password, access denied')
        })
    })
}