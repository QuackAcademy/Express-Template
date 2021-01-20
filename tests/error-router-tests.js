const request = require('supertest');
const server = require('../server.js');

let token = '';
let lastErrorID = '';
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

    describe('POST /errors/getByQuery', () => {
        it('Should return status 400 if password is missing', async () => {
            const res = await request(server).post(`/api/error/getByQuery`)
            .set({'authorization': token});
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual('Protected endpoint, password is required')
        })
        it('Should return status 400 if sortType has an invalid value', async () => {
            const res = await request(server).post(`/api/error/getByQuery`)
            .send({ password: 'quackquack', sortType: 'fish' }).set({'authorization': token});
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual('sortType can only be set to null, asc, or desc')
        })
        it('Should return status 400 if userID has an invalid value', async () => {
            const res = await request(server).post(`/api/error/getByQuery`)
            .send({ password: 'quackquack', userID: 'fish' }).set({'authorization': token});
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual('userID must be null or a number')
        })
        it('Should return status 403 if password incorrect', async () => {
            const res = await request(server).post(`/api/error/getByQuery`)
            .send({ password: 'wrong password' }).set({'authorization': token});
            expect(res.status).toBe(403);
            expect(res.body.message).toEqual('Invalid Password, access denied')
        })
        it('Should return status 200 and errors for valid requests', async () => {
            const res = await request(server).post(`/api/error/getByQuery`)
            .send({ password: 'quackquack', sortType: 'asc' }).set({'authorization': token});
            expect(res.status).toBe(200);
            lastErrorID = res.body[res.body.length-1].id;
        })
    })
    describe('DELETE /errors/getByQuery', () => {
        it('Should return status 400 if password is missing', async () => {
            const res = await request(server).delete(`/api/error/deleteByQuery`)
            .set({'authorization': token});
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual('Protected endpoint, password is required')
        })
        it('Should return status 400 if userID has an invalid value', async () => {
            const res = await request(server).delete(`/api/error/deleteByQuery`)
            .send({ password: 'quackquack', userID: 'fish' }).set({'authorization': token});
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual('userID must be null or a number')
        })
        it("Should return status 400 if deleteAll isn't true and no query vars provided", async () => {
            const res = await request(server).delete(`/api/error/deleteByQuery`)
            .send({ password: 'quackquack', }).set({'authorization': token});
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual('deleteAll must be true if trying to delete everything. Otherwise, provide query vars.')
        })
        it('Should return status 403 if password incorrect', async () => {
            const res = await request(server).delete(`/api/error/deleteByQuery`)
            .send({ password: 'wrong password' }).set({'authorization': token});
            expect(res.status).toBe(403);
            expect(res.body.message).toEqual('Invalid Password, access denied')
        })
        it('Should be able to delete a single error', async () => {
            const res = await request(server).delete(`/api/error/deleteByQuery`)
            .send({ password: 'quackquack', errorID: lastErrorID}).set({'authorization': token});
            expect(res.status).toBe(200);
            expect(res.body.message).toEqual('Error(s) successfully deleted.')
        })
        it('Should be able to delete errors from userID', async () => {
            const date = new Date();
            const formattedDate = `${date.getMonth()+1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1}/${date.getDate() < 10 ? `0${date.getDate()}`: date.getDate()}/${date.getFullYear()}`;
            const res = await request(server).delete(`/api/error/deleteByQuery`)
            .send({ password: 'quackquack', fromDate: formattedDate, }).set({'authorization': token});
            expect(res.status).toBe(200);
            expect(res.body.message).toEqual('Error(s) successfully deleted.')
        })
        // it('Should be able to delete errors by date range', async () => {
        //     const res = await request(server).delete(`/api/error/deleteByQuery`)
        //     .send({ password: 'quackquack', }).set({'authorization': token});
        //     expect(res.status).toBe(200);
        //     expect(res.body.message).toEqual('Error(s) successfully deleted.')
        // })
        // it('Should be able to delete all errors', async () => {
        //     const res = await request(server).delete(`/api/error/deleteByQuery`)
        //     .send({ password: 'quackquack', }).set({'authorization': token});
        //     expect(res.status).toBe(200);
        //     expect(res.body.message).toEqual('Error(s) successfully deleted.')
        // })
        // it('Should return status 404 if no errors found for provided query', async () => {
        //     const res = await request(server).delete(`/api/error/deleteByQuery`)
        //     .send({ password: 'quackquack', }).set({'authorization': token});
        //     expect(res.status).toBe(404);    
        //     expect(res.body.message).toEqual('No errors found')
        // })
    })
}