const request = require('supertest');
const server = require('../server.js');

const getToken = async () => {
    const loginResponse = await request(server).post('/api/auth/login').send({ username: "QHtestuser12039c1243124", password: "testO023123#@#adSD" });
    return loginResponse.body.token;
}

module.exports = () => {
    const token = getToken();
    
    //#region users router
        // case `/users get /:id 400`: status = 400; responseObj = { message: `Param id must be a number. Received: ${req.params.id}` }; break;
        // case `/users get /:id 404`: status = 404; responseObj = { message: `User with id ${req.user.id} not found` }; break;
        // case `/users get /user 404`: status = 404; responseObj = { message: `User with id ${req.user.id} not found` }; break;
        // case `/users put /user 400`: status = 400; responseObj = { message: `Current password is required` }; break;
        // case `/users put /user 400-2`: status = 400; responseObj = { message: `Username must only contain characters A-Z, _, and 0-9. Username must start with a letter` }; break;
        // case `/users put /user 403`: status = 403; responseObj = { message: `Invalid credentials` }; break;
        // case `/users put /user 404`: status = 404; responseObj = { message: `User not found` }; break;
        // case `/users put /user 409`: status = 409; responseObj = { message: `Username '${req.username}' is already in use` }; break;
        // case `/users put /user 409-2`: status = 409; responseObj = { message: `Email '${req.email}' is already in use` }; break;
        // case `/users delete /user 400`: status = 400; responseObj = { message: 'Password is required to delete user' }; break;
        // case `/users delete /user 403`: status = 403; responseObj = { message: 'Invalid credentials' }; break;
    //#endregion

    // describe('GET /', () => {
    //     it('Should return status 200', async () => {
    //         const res = await request(server).get('/');
    //         expect(res.status).toBe(200);
    //     });
    //     it('Should return the correct object', async () => {
    //         const res = await request(server).get('/');
    //         expect(res.type).toBe('application/json');
    //         expect(res.body).toEqual({message: 'hi'});
    //     });
    // });
}