//#region imports and inits
module.exports = executeAsBot;

"use strict";

const fs = require('fs');
const path = require("path");
const config = require('../store/config.json');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

const SteamSession = require('steam-session');
let session = new SteamSession.LoginSession(SteamSession.EAuthTokenPlatformType.SteamClient);

const SteamUser = require('steam-user');
let client = new SteamUser();

let token;
//#endregion

async function logOnWithTokenFile() {
    try {
        token = fs.readFileSync(path.join(__dirname, '../store/token')).toString();
    } catch (err) {
        console.log('No token file found.');
        await authenticate();
        logOnWithTokenFile();
        return;
    }
    client.logOn({"refreshToken" : token});
    console.log('Logging in as ' + config.user);
}

async function authenticate() {
    let initialRes = await session.startWithCredentials({
        "accountName": config.user,
        "password": config.pword
    });

    if (initialRes.validActions.find(action => action.type === SteamSession.EAuthSessionGuardType.DeviceCode)) {
        readline.question("Input Steam Guard Code: ", code => {
            session.submitSteamGuardCode(code);
        });
    } else {
        console.log('Unsupported authenticating method required. Method ID: ' + initialRes.validActions[0].type);
    }
}

session.on('authenticated', async () => {
    console.log('Authentication Successful');
    fs.writeFile(path.join(__dirname, '../store/token'), session.refreshToken);
});

client.on('loggedOn', () => {
    console.log('Logged in successfully.');
    client.setPersona(SteamUser.EPersonaState.Online);
});

client.on('accountInfo', nick => {
    client.gamesPlayed([nick + ' is currently busy, but you can talk with ME', 730, 322170, 380600, 440], true);
})

client.on('friendMessage', async steamID => {
    await client.chat.sendFriendMessage(steamID, 'UWU');
});

logOnWithTokenFile();

function executeAsBot(js) {
    try {
        new Function(js)();
    } catch (e) {
        console.log(e);
        return false;
    }
    return true;
}