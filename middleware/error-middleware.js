
const { discordMessage, slackMessage } = require("../utils.js");
const dbMethods = require("../data/db-model.js");


exports.handleError = async (err, req, res) => {
    let errObj = { endpoint: req.endpoint, user_id: req.user ? req.user.id : null}; 
    let status = ''; let responseObj = '';
    let defaultReached = false;
    let sendError = true;

    switch (err) {
        //#region auth router
        case `/auth post /register 400`: status = 400; responseObj = { message: 'email is required' }; break;
        case `/auth post /register 400-2`: status = 400; responseObj = { message: 'cognito_username is required' }; break;
        case `/auth post /register 400-3`: status = 400; responseObj = { message: 'emailOptIn must be a bool' }; break;
        case `/auth post /register 403`: status = 403; responseObj = { message: 'Invalid register_password code' }; break;//#endregion
        //#region users router
        case `/users get /:id 400`: status = 400; responseObj = { message: `Param id must be a number. Received: ${req.params.id}` }; break;
        case `/users get /:id 404`: status = 404; responseObj = { message: `User with id ${req.user.id} not found` }; break;
        case `/users get /user 404`: status = 404; responseObj = { message: `User with id ${req.user.id} not found` }; break;
        case `/users put /user 404`: status = 404; responseObj = { message: `User with id ${req.user.id} not found` }; break;
        case `/users delete /user 400`: status = 400; responseObj = { message: 'Password is required to delete user' }; break;
        case `/users delete /user 403`: status = 403; responseObj = { message: 'Invalid credentials' }; break;
        //#endregion
        //#region functions
        case `utils.js discordMessage 500`: status = 500; responseObj = { message: 'Error sending message to Discord' }; break;
        case `utils.js slackMessage 500`: status = 500; responseObj = { message: 'Error sending message to Slack' }; break;
        //#endregion
        default: defaultReached = true; status = 500; responseObj = { message: `${errObj.endpoint} 500 error`, error: err }; 
            console.log(`${responseObj.message}, error: ${err}`);
    }

    if (defaultReached){ errObj.errorID = responseObj.message; errObj.errorMessage = err; }
    else{ errObj.errorID = err; errObj.errorMessage = responseObj.message; }
    
    let user = '';
    if (req.user){
        if (req.user.id){ user = await dbMethods.findById('users', req.user.id); }
    }

    const errorLogged = await dbMethods.add('errors', errObj);

    if (errorLogged){ 
        let errorText = ''
        if (status === 500){ errorText = `Error 500 at ${errObj.endpoint}.\nMessage: ${errObj.errorMessage}. ${user ? `User: ${user.first_name} ${user.last_name} ID: ${req.user ? req.user.id : ''}` : ''}`; }
        else { errorText = `Error ${errObj.errorID} at ${errObj.endpoint}.\nMessage: ${errObj.errorMessage}. ${user ? `User: ${user.first_name} ${user.last_name} ID: ${req.user ? req.user.id : ''}` : ''}`; }
        console.error(errorText);

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