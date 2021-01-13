if (process.env.DB_ENV !== 'production'){ require('dotenv').config(); }

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRouter = require('./routers/auth-router.js');
const userRouter = require('./routers/users-router.js');

const authenticate = require('./middleware/authenticate-middleware.js');
const { handleError } = require('./middleware/error-middleware.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/users', authenticate, userRouter);

server.use((err, req, res, next) => { handleError(err, req, res); });

server.get('/', (req, res) => {
    res.status(200).json({message: 'hi'});
});

module.exports = server;