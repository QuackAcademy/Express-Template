const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db = require('../data/db-config.js');
const userDb = require('../data/users-model.js');
const {generateToken} = require('./token.js');
const {validateZipCode} = require('../utils.js');
const routerName = '/auth'

router.post('/register', async (req, res) => {
    const endpoint = `${routerName} post /register`;
    const user = { email, username, password, name, zipCode } = req.body;
    console.log('registering ', username);
    for(let val in user){
        if(typeof user[val] === 'string'){
            user[val] = user[val].toLowerCase();
        } 
    };
   
    try{
        if(!(username && password && email)){ throw 1 }
        else if(!(/^[a-z][a-z0-9_]*$/i.test(username))){ throw 2 }

        const foundUsername = await db('users')
        .where({username: user.username})
        .first();

        if(foundUsername){ throw 3 }

        const foundEmail = await db('users')
        .where({email: user.email})
        .first();

        if(foundEmail){ throw 4 }
        if(!name){ throw 6 }

        validateZipCode(zipCode, endpoint, req);
        
        const [id] = await userDb.add({...user, password: bcrypt.hashSync(password, 12)});

        const response = await db('users').select('id', 'username').where({id}).first();

        res.status(201).json({id :response.id, username: response.username});
    }catch(err){
        if(err === 1){
            res.status(400).json({message: `Email, username and password are required.`});
        }
        else if(err === 2){
            res.status(400).json({message: 'Username must only contain characters A-Z, _, and 0-9. Username must start with a letter.'});
        }
        else if(err === 3){
            res.status(409).json({message: `Username '${user.username}' is already in use.`});
        }
        else if(err === 4){
            res.status(409).json({message: `There is already an account associated with that email`});
        }
        else if(err === 6){
            res.status(400).json({message: `Name is required`});
        }
        else{
            console.log(err);
            res.status(500).json({message: 'Server could not add user.', error: err});
        }
    }
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    if(username && password){
        const user = await db('users as u').where({'u.username': username.toLowerCase()})
            .leftJoin('farms as f', 'u.id', 'f.id')
            .select('u.*', 'f.name as farmName')
            .first();
        if(user && bcrypt.compareSync(password, user.password)){
            const token = await generateToken(user);
            res.status(200).json({message: `Welcome ${user.name}`, token, user: {...user, password: undefined}});
        }else{
            res.status(403).json({message: 'Invalid username or password'});
        }
    }else{
        res.status(400).json({message: 'Please provide a username and password'});
    }
});

module.exports = router;