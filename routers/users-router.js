const router = require('express').Router();
const bcrypt = require('bcryptjs');
const userDb = require('../data/users-model');
const routerName = '/users';

const db = require('../data/db-config');

// get by token
router.get('/user', async (req, res, next) => {
    const endpoint = `${routerName} get /user`;
    req.endpoint = endpoint;
    try{
        const user = await db('users as u').where({'u.id': req.user.id}).select('u.*').first();
        if(user){ res.status(200).json({...user, password: null}); }
        else{ throw `${endpoint} 404`; }
    } catch(err){ next(err); }
});

// get all users: for debugging, remove when finished
router.get('/user/all', async (req, res, next) => {
    const endpoint = `${routerName} get /user/all`;
    req.endpoint = endpoint;
    try{
        const users = await db('users').select('id', 'email', 'username', 'fullName');

        if(users.length){ res.status(200).json(users); }
        else{ res.status(200).json({message: `No users found`}); }
    } catch(err){ next(err); }
});

// get by id
router.get('/:id', async (req, res, next) => {
    const endpoint = `${routerName} get /:id`;
    req.endpoint = endpoint;
    try{
        if(isNaN(req.params.id)){ req.received = req.params.id; throw `${endpoint} 400`; }
        const user = await userDb.findById(req.params.id);
        if(user){ res.status(200).json({...user, password: null}); }
        else{ throw `${endpoint} 400`; }
    } catch(err){ next(err)}
});

// put by token
router.put('/user', async (req, res, next) => {
    const endpoint = `${routerName} put /user`;
    req.endpoint = endpoint;
    const { email, username, fullName, } = req.body;
    const newValues = { email, username, fullName, };
    let { password, newPassword } = req.body;

    for(let val in newValues){
        if(typeof newValues[val] === 'string'){
            newValues[val] = newValues[val].toLowerCase();
        } 
    };
   
    try{
        if(!password){ throw `${endpoint} 400`; }
        if(username){
            if(!(/^[a-z][a-z0-9_]*$/i.test(username))){ throw `${endpoint} 400-2`; }
            const foundUsername = await db('users').where({username: newValues.username}).first();
            if(foundUsername){ req.username = username; throw `${endpoint} 409`; }
        }
        if(email){
            const foundEmail = await db('users').where({email: newValues.email}).first();
            if(foundEmail){ req.email = email; throw `${endpoint} 409-2`; }
        }

        const user = await db('users').where({id: req.user.id}).first();
        if(!user){ throw `${endpoint} 404`; }
        if(bcrypt.compareSync(password, user.password)){
            if(newPassword){ password = bcrypt.hashSync(newPassword, 12); }
            const updated = await userDb.update(req.user.id, newPassword ? {...newValues, password} : {...newValues});
            if(updated){
                const updatedUser = await userDb.findBy({id: req.user.id}).select('id', 'username', 'email', 'fullName',);
                res.status(200).json({...updatedUser});
            }
        }
        else{ throw `${endpoint} 403`; }
    } catch(err){ next(err); }
});

// delete by token
router.delete('/user', async (req, res, next) => {
    const endpoint = `${routerName} delete /user`;
    req.endpoint = endpoint;
    const {password} = req.body;

    try{
        if (!password){ throw `${endpoint} 400`; }

        const user = await db('users')
        .where({id: req.user.id})
        .first();

        if(user && bcrypt.compareSync(password, user.password)){
            await userDb.remove(req.user.id);
            res.status(200).json({message: 'User successfully deleted'});
        }
        else{ throw `${endpoint} 403`; }
    } catch(err){ next(err); }
});

module.exports = router;