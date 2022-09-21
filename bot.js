const config = require('./config.json');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

const SteamSession = require('steam-session');
const SteamUser = require('steam-user');

let client = new SteamUser();

let session = new SteamSession.LoginSession(SteamSession.EAuthTokenPlatformType.SteamClient);
let initialRes = (async () => { session.startWithCredentials({
    "accountName" : config.user,
    "password" : config.pword
})();

console.log('Logging in as ' + config.user);

client.logOn({
    "accountName" : config.user,
    "password" : config.pword,
});

client.on('steamGuard', (domain, callback, lastCodeWrong) => {
    if(lastCodeWrong) console.log('Incorrect Code, try again');
    readline.question('Input SG Code: ', code => {
        callback(code);
    })
});

client.on('loggedOn', () => {
    console.log('Logged in successfully.');
    client.setPersona(SteamUser.EPersonaState.Online);
    client.gamesPlayed([730], true);
    setTimeout(() => client.gamesPlayed([]), 1000 * 60 * 15);
});