const serverTests = require('./server-tests.js');
const authTests = require ('./auth-router-tests.js');
const userTests = require ('./users-router-tests.js');
const errorTests = require ('./users-router-tests.js');
const db = require('../data/db-config');

const setup = async () => { await db('users').truncate(); }

setup();
describe('Server tests', serverTests);
describe('Auth router tests', authTests);
describe('Users router tests', userTests);
// describe('Error router tests', errorTests);