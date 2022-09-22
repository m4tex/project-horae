const fs = require('fs');
const config = require('./config.json')
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

const SteamSession = require('steam-session');
const SteamUser = require('steam-user');

let client = new SteamUser();

let authenticated = false;
let session = new SteamSession.LoginSession(SteamSession.EAuthTokenPlatformType.SteamClient);

//Main
(async () => {
    console.log('Logging in as ' + config.user);

    let initialRes = await session.startWithCredentials({
        "accountName": config.user,
        "password": config.pword
    })

    let awaitCode = false;

    while (!authenticated) {
        if(awaitCode) continue;

        if (initialRes.validActions.find(action => action.type === SteamSession.EAuthSessionGuardType.DeviceCode)) {
            awaitCode = true;
            await readline.question("Input Steam Guard Code: ", async code => {
                await session.submitSteamGuardCode(code);
                awaitCode = false;
            });
        } else {
            console.log('Unsupported authenticating method required. ' + initialRes.validActions[0].type);
            break;
        }
    }

    console.log('past loop');

    session.on('authenticated', () => {
        console.log('Authenticated');
        authenticated = true;
        fs.writeFileSync('./token', session.refreshToken);
    })
})();


// client.logOn({
//     "accountName": config.user,
//     "password": config.pword,
// });

// client.on('steamGuard', (domain, callback, lastCodeWrong) => {
//     if (lastCodeWrong) console.log('Incorrect Code, try again');
//     readline.question('Input SG Code: ', code => {
//         callback(code);
//     })
// });
//
// client.on('loggedOn', () => {
//     console.log('Logged in successfully.');
//     client.setPersona(SteamUser.EPersonaState.Online);
//     client.gamesPlayed([730], true);
//     setTimeout(() => client.gamesPlayed([]), 1000 * 60 * 15);
// });