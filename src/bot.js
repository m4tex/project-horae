//#region imports and inits
"use strict";

const fs = require('fs');
const path = require("path");
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

const SteamSession = require('steam-session');
let session = new SteamSession.LoginSession(SteamSession.EAuthTokenPlatformType.SteamClient);

const SteamUser = require('steam-user');
let client = new SteamUser();

let token;
let authRes; //temporary

module.exports = {
    client,
    session,
    logOnWithTokenFile
};
//#endregion

async function logOnWithTokenFile(res) {
    res.send({"hewwow": "OWO"});
    try {
        token = fs.readFileSync(path.join(__dirname, '../store/token')).toString();
        client.logOn({"refreshToken" : token});
        console.log('Logging in as ' + config.user);
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('No token file found.');
            const config = require('../store/config.json');
            authRes = res;
            if (await authenticate(config)) {
                logOnWithTokenFile(res);
            }
        }
        else {
            console.log('unexpected/unhandled module err');
            throw err;
        }
    }
}

async function authenticate(credentials) {
    let initialRes
    try {
        initialRes = await session.startWithCredentials({
            "accountName": credentials.user,
            "password": credentials.pword
        });
    }
    catch(err) {
        authRes.send({ "ERR" : "AUTH_FAILED" })
        return false;
    }

    if (initialRes.validActions.find(action => action.type === SteamSession.EAuthSessionGuardType.DeviceCode)) {
        readline.question("Input Steam Guard Code: ", async code => {
            await session.submitSteamGuardCode(code);
        });
        return true;
    } else {
        authRes.send({"ERR" : "AUTH_UNSUPPORTED"});
        console.log('Unsupported authenticating method required. Method ID: ' + initialRes.validActions[0].type);
        return false;
    }
}

session.on('authenticated', async () => {
    console.log('Authentication Successful');
    authRes.send();
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