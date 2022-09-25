//Starts the bot module and gets the function for command calls from its scope
// const executeAsBot = require('./bot');

//Not the best option for checking whether the file exists or not, but it works good enough...
let config;
try {
    config = require('../store/config.json');
}
catch (e) {
    console.log('No config found');
}

// const { exec } = require('child_process');
const fs = require("fs");
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
    fs.writeFileSync('./config.json', req.body.config);
});

app.get('/api/config', (req, res) => {
    res.send(config);
});

//Meant to be called multiple times a second
app.get('/api/console', (req, res) => {

});

app.post('/api/auth', (req,res) => {
    console.log(req.body);
});