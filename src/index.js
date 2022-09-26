//Starts the bot module and gets the function for command calls from its scope
const { executeAsBot, botExec, logOnWithTokenFile} = require('./bot');

//Not the best option for checking whether the file exists or not, but it works good enough...
let config;
try {
    config = require('../store/config.json');
}
catch (e) {
    if (e.code === 'MODULE_NOT_FOUND')
        console.log('No config found');
    else throw e;
}

// const { exec } = require('child_process');
const fs = require("fs");
const path = require("path");
const express = require('express');
const app = express();
const port = 420;

app.use(express.json());
app.use(express.static('public'));

app.listen(port, () => {
    console.log('Settings server listening on localhost:' + port.toString());
    // exec(process.platform === 'win32' ? 'start http://localhost:420' : process.platform === 'linux' ? 'xdg-open www.google.com' : 'exit' );
    console.log('If your browser didn\'t open automatically, open your browser and navigate to: http://localhost:420/');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/api/command', (req, res) => {
    // executeAsBot(req.body.command);
});

app.post('/api/config', (req, res) => {
    console.log('config');
    fs.writeFileSync(path.join(__dirname, '../store/config.json'), JSON.stringify(req.body));
    res.send();
});

//Meant to be called multiple times a second
// app.get('/api/console', (req, res) => {
//
// });

app.get('/api/auth', async (req,res) => {
    console.log('loggin in')
    logOnWithTokenFile(res);

});