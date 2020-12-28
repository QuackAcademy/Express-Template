const axios = require ('axios');
const functionFile = 'utils.js';


const discordMessage = (channel, message) => {
    const functionName = `${functionFile} discordMessage`;
    let url = ''
    switch (channel){
        case `Bug`: url = process.env.discordBugUrl; break;
        case `Error`: url = process.env.discordErrorUrl; break;
        case `Register`: url = process.env.discordSignupUrl; break;
        case `Sugg`: url = process.env.discordSuggUrl; break;
        case `Stats`: url = process.env.discordStatsUrl; break;
        default: url = process.env.discordErrorUrl;
    }

    axios.post(url, {content: message})
    .then(response => { })
    .catch(err => { 
        console.log('discordMessage error:', err);
        throw `${functionName} 500`; 
    });
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

    axios.post(url, {text: message})
    .then(response => { })
    .catch(err => { 
        console.log('slackMessage error:', err);
        throw `${functionName} 500`; 
    });
}

module.exports = { slackMessage, discordMessage }