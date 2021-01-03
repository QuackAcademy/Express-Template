const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db = require('../data/db-config.js');
const userDb = require('../data/users-model.js');
const {generateToken} = require('./token.js');
const routerName = '/auth'

router.post('/register', async (req, res, next) => {
    const endpoint = `${routerName} post /register`;
    req.endpoint = endpoint;
    const user = { email, username, password, fullName } = req.body;

    for(let val in user){
        if(typeof user[val] === 'string'){
            user[val] = user[val].toLowerCase();
        } 
    };
   
    try{
        if(!(username && password && email && fullName)){ throw `${endpoint} 400`; }
        else if(!(/^[a-z][a-z0-9_]*$/i.test(username))){ throw `${endpoint} 400-2`; }
        
        const foundUsername = await db('users').where({username: user.username}).first();
        if(foundUsername){ req.username = username; throw `${endpoint} 409`; }

        const foundEmail = await db('users').where({email: user.email}).first();
        if(foundEmail){ req.email = email; throw `${endpoint} 409-2`; }
        
        const [id] = await userDb.add({...user, password: bcrypt.hashSync(password, 12)});
        const response = await db('users').select('id', 'username').where({id}).first();

        res.status(201).json({message: `Successfully added user #${response.id}`, id :response.id, username: response.username});
    } catch(err){ next(err); }
});

router.post('/login', async (req, res, next) => {
    const endpoint = `${routerName} post /login`;
    req.endpoint = endpoint;
    const {username, password} = req.body;

    try{
        if(!username || !password){ throw `${endpoint} 400`; }
        const user = await db('users as u').where({'u.username': username.toLowerCase()}).first();
    
        if(user && bcrypt.compareSync(password, user.password)){
            const token = await generateToken(user);
            res.status(200).json({message: `Welcome ${user.fullName}`, token, user: {...user, password: undefined}});
        }
        else{ throw `${endpoint} 403`; }
    } catch(err){ next(err); }
});

module.exports = router;