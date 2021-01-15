
const { discordMessage, slackMessage } = require("../utils.js");
const dbMethods = require("../data/db-model.js");


exports.handleError = async (err, req, res) => {
    let errObj = { endpoint: req.endpoint, user_id: req.user ? req.user.id : null}; 
    let status = ''; let responseObj = '';
    let defaultReached = false;
    let sendError = true;

    switch (err) {
        //#region auth router
        case `/auth post /register 400`: status = 400; responseObj = { message: 'Email, username, password, and fullName are required.' }; break;
        case `/auth post /register 400-2`: status = 400; responseObj = { message: 'Username must only contain characters A-Z, _, and 0-9. Username must start with a letter.' }; break;
        case `/auth post /register 409`: status = 409; responseObj = { message: `Username '${req.username}' is already in use.` }; break;
        case `/auth post /register 409-2`: status = 409; responseObj = { message: `There is already an account associated with the email: ${req.email}` }; break;
        case `/auth post /login 400`: status = 400; responseObj = { message: 'Username and Password are required' }; break;
        case `/auth post /login 403`: status = 403; responseObj = { message: 'Invalid username or password' }; break;
        //#endregion
        //#region error router
        case `/errors post /getByQuery 400`: status = 400; responseObj = { message: 'Protected endpoint, password is required' }; break;
        case `/errors post /getByQuery 400-2`: status = 400; responseObj = { message: 'sortType can only be set to null, asc, or desc' }; break;
        case `/errors post /getByQuery 400-3`: status = 400; responseObj = { message: 'userID must be null or a number' }; break;
        case `/errors post /getByQuery 403`: status = 403; responseObj = { message: 'Invalid Password, access denied' }; break;
        case `/errors post /getByQuery 404`: status = 404; responseObj = { message: 'No errors found' }; break;
        case `/errors delete /deleteByQuery 400`: status = 400; responseObj = { message: 'Protected endpoint, password is required' }; break;
        case `/errors delete /deleteByQuery 400-2`: status = 400; responseObj = { message: 'userID must be null or a number' }; break;
        case `/errors delete /deleteByQuery 400-3`: status = 400; responseObj = { message: 'deleteAll must be true if trying to delete everything. Otherwise, provide query vars.' }; break;
        case `/errors delete /deleteByQuery 403`: status = 403; responseObj = { message: 'Invalid Password, access denied' }; break;
        case `/errors delete /deleteByQuery 404`: status = 404; responseObj = { message: 'No errors found' }; break;
        //#endregion
        //#region users router
        case `/users get /:id 400`: status = 400; responseObj = { message: `Param id must be a number. Received: ${req.received}` }; break;
        case `/users get /:id 404`: status = 404; responseObj = { message: `User with id ${req.received} not found` }; break;
        case `/users get /user 404`: status = 404; responseObj = { message: `User with id ${req.user.id} not found` }; break;
        case `/users put /user 400`: status = 400; responseObj = { message: `Current password is required` }; break;
        case `/users put /user 400-2`: status = 400; responseObj = { message: `No new values were sent` }; break;
        case `/users put /user 400-3`: status = 400; responseObj = { message: `Username must only contain characters A-Z, _, and 0-9. Username must start with a letter` }; break;
        case `/users put /user 403`: status = 403; responseObj = { message: `Invalid credentials` }; break;
        case `/users put /user 404`: status = 404; responseObj = { message: `User not found` }; break;
        case `/users put /user 409`: status = 409; responseObj = { message: `Username '${req.username}' is already in use` }; break;
        case `/users put /user 409-2`: status = 409; responseObj = { message: `Email '${req.email}' is already in use` }; break;
        case `/users delete /user 400`: status = 400; responseObj = { message: 'Password is required to delete user' }; break;
        case `/users delete /user 403`: status = 403; responseObj = { message: 'Invalid credentials' }; break;
        case `/users delete /user 404`: status = 404; responseObj = { message: `User not found` }; break;
        //#endregion
        //#region functions
        case `authenticate-middleware.js 400`: status = 400; responseObj = { message: `No token was provided` }; break;
        case `authenticate-middleware.js 401`: status = 401; responseObj = { message: `Invalid token` }; break;
        case `utils.js discordMessage 500`: status = 500; responseObj = { message: 'Error sending message to Discord' }; break;
        case `utils.js slackMessage 500`: status = 500; responseObj = { message: 'Error sending message to Slack' }; break;
        case `utils.js validateZipCode 400`: status = 400; responseObj = { message: `Zip code is required. Endpoint: ${req.endpoint}` }; break;
        case `utils.js validateZipCode 400-2`: status = 400; responseObj = { message: `Zip code must be five digits. Endpoint: ${req.endpoint}` }; break;
        case `utils.js validateZipCode 400-3`: status = 400; responseObj = { message: `Zip code must be a number. Endpoint: ${req.endpoint}` }; break;
        //#endregion
        default: defaultReached = true; status = 500; responseObj = { message: `${errObj.endpoint} 500 error`, error: err }; 
            console.log(`${responseObj.message}, error: ${err}`);
    }

    if (defaultReached){ errObj.errorID = responseObj.message; errObj.errorMessage = err; }
    else{ errObj.errorID = err; errObj.errorMessage = responseObj.message; }
    
    let user = '';
    if (req.user && req.user.id){ user = await dbMethods.findById('users', req.user.id); }

    const errorLogged = await dbMethods.add('errors', errObj);

    if (errorLogged){ 
        let errorText = ''
        if (status === 500){ errorText = `Error 500 at ${errObj.endpoint}.\nMessage: ${errObj.errorMessage}. ${user ? `User: ${user.first_name} ${user.last_name} ID: ${req.user ? req.user.id : ''}` : ''}`; }
        else { errorText = `Error ${errObj.errorID} at ${errObj.endpoint}.\nMessage: ${errObj.errorMessage}. ${user ? `User: ${user.first_name} ${user.last_name} ID: ${req.user ? req.user.id : ''}` : ''}`; }
        if (process.env.DB_ENV !== 'testing'){ console.error(errorText); }

        res.status(status).json(responseObj);

        if (sendError){
            try{
                slackMessage('Error', errorText);
                discordMessage('Error', errorText);
            }
            catch(err){ console.log(`error-middleware.js slack/discord error ${err.response ? err.response.statusText : err}`); }
        }
    }
    else{
        console.error(`Something broke inside handleErrors. Not good, investigate immediately! errorLogged: ${errorLogged}`);
        res.status(status).json(responseObj);
    }
}