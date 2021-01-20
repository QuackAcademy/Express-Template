const axios = require ('axios');
const functionFile = 'utils.js';


const discordMessage = (channel, message) => {
    const functionName = `${functionFile} discordMessage`;
    let url = ''
    switch (channel){
        case `Error`: url = process.env.discordErrorUrl; break;
        case `Register`: url = process.env.discordSignupUrl; break;
        case `Stats`: url = process.env.discordStatsUrl; break;
        default: url = process.env.discordErrorUrl;
    }

    if(url){
        axios.post(url, {content: message})
        .then(response => { })
        .catch(err => { 
            console.log('discordMessage error:', err);
            throw `${functionName} 500`; 
        });
    }
    // else { console.log('Add process.env.discordErrorUrl if you want discord webhook to fire'); }
}

const slackMessage = (channel, message) => {
    const functionName = `${functionFile} slackMessage`;
    let url = ''
    switch (channel){
        case `Error`: url = process.env.slackErrorUrl; break;
        case `Register`: url = process.env.slackSignupUrl; break;
        case `Stats`: url = process.env.slackStatsUrl; break;
        default: url = process.env.slackErrorUrl;
    }

    if(url){
        axios.post(url, {text: message})
        .then(response => { })
        .catch(err => { 
            console.log('slackMessage error:', err);
            throw `${functionName} 500`; 
        });
    }
    // else { console.log('Add process.env.slackErrorUrl if you want slack webhook to fire'); }
}

const isValidEmail = (email) => {
    if (!/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email)){
        return false;
    }
    else { return true; }
}

const validateZipCode = (zipCode, endpoint, req) => {
    const functionName = `${functionFile} validateZipCode`;
    req.endpoint = endpoint;
    if (!zipCode){ throw `${functionName} 400`; }
    if (zipCode.length !== 5){ throw `${functionName} 400-2`; }
    if (isNaN(zipCode)){ throw `${functionName} 400-3`; }
}

const validateDate = (date) => {
    const functionName = `${functionFile} validateDate`;

    if (isNaN(Number(date.slice(0,2)))) {throw `${functionName} 400`;}
    if (date.slice(2,3) !== '/') {throw `${functionName} 400`;}
    if (isNaN(Number(date.slice(3,5)))) {throw `${functionName} 400`;}
    if (date.slice(5,6) !== '/') {throw `${functionName} 400`;}
    if (isNaN(Number(date.slice(6,10)))) {throw `${functionName} 400`;}

    if (Number(date.slice(0,2) < 1 || Number(date.slice(0,2) > 12)) ) {throw `${functionName} 400-2`;}
    if (Number(date.slice(3,5) < 1 || Number(date.slice(3,5) > 31)) ) {throw `${functionName} 400-3`;}
    
    return true;
}

module.exports = { slackMessage, discordMessage, isValidEmail, validateZipCode, validateDate }