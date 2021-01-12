const request = require('supertest');
const server = require('../server.js');


module.exports = () => {
    describe('GET /', () => {
        it('Should return status 200', async () => {
            const res = await request(server).get('/');
            expect(res.status).toBe(200);
        });
        it('Should return the correct object', async () => {
            const res = await request(server).get('/');
            expect(res.type).toBe('application/json');
            expect(res.body).toEqual({message: 'hi'});
        });
    });
}