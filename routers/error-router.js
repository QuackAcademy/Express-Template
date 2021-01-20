const router = require('express').Router();
const db = require('../data/db-config.js');
const utils = require('../utils.js');
const routerName = '/errors';
process.env.topSecretCode ?? console.log('Missing environment variable "topSecretCode" in error-router.js');


// get errors by req.body query vars
router.post('/getByQuery', async (req, res, next) => {
    const endpoint = `${routerName} post /getByQuery`;
    req.endpoint = endpoint;
    const {password, errorID, userID, fromDate} = req.body;
    let {toDate, sortType} = req.body;

    try{
        if(!password){ throw `${endpoint} 400`; }
        if(password !== process.env.topSecretCode){ throw `${endpoint} 403`; }

        if (!sortType){sortType = 'desc'}
        if (sortType !== 'desc' && sortType !== 'asc') { throw `${endpoint} 400-2`; }

        if (fromDate){
            utils.validateDate(fromDate);
            if (toDate) { utils.validateDate(toDate); }
            else { toDate = new Date(); }
        }

        if(userID && isNaN(userID)){ throw `${endpoint} 400-3`; }

        const result = await db('errors').where((qb) => {
                if (fromDate){ qb.whereBetween('errorDate', [fromDate, toDate]); }
                if (errorID){ qb.andWhere({errorID}); }
                if (userID){ qb.andWhere({'user_id': userID}); }
            })
            .orderBy('errorDate', sortType);

        if(result){ res.status(200).json(result); } 
        else{ res.status(200).json({message: 'No errors found with provided values'}); }
    } catch (err) { next(err); }
});

// delete errors by req.body query vars
router.delete('/deleteByQuery', async (req, res, next) => {
    const endpoint = `${routerName} delete /deleteByQuery`;
    req.endpoint = endpoint;
    const {password, errorID, userID, fromDate, deleteAll} = req.body;
    let {toDate} = req.body;

    try{
        if(!password){ throw `${endpoint} 400`; }
        if(password !== process.env.topSecretCode){ throw `${endpoint} 403`; }

        if (fromDate){
            utils.validateDate(fromDate);
            if (toDate) { utils.validateDate(toDate); }
            else { toDate = new Date(); }
        }

        if(userID && isNaN(userID)){ throw `${endpoint} 400-2`; }

        if (!deleteAll && !fromDate && !errorID && !userID){ throw `${endpoint} 400-3`; }

        const result = await db.transaction(async trx => {
            try {
                const deleted = await trx('errors').where((qb) => {
                    if (fromDate){ qb.whereBetween('errorDate', [fromDate, toDate]); }
                    if (errorID){ qb.andWhere({id: errorID}); }
                    if (userID){ qb.andWhere({'user_id': userID}); }
                })
                .del();

                if (deleted){ console.log(`deleteByQuery: ${deleted} error(s) deleted`); return true; }
                else { throw `${endpoint} 404`; }
            } catch (err) { throw err; }
        });

        if(result){ res.status(200).json({message: 'Error(s) successfully deleted.'}); } 
    } catch (err) { next(err); }
});

module.exports = router;