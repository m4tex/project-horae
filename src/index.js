//Starts the bot module and gets the function for command calls from its scope
// const executeAsBot = require('./bot');
const config = require('../store/config.json');
const fs = require("fs");
const express = require('express');
const app = express();
const port = 420;

if (Object.values(config).filter(x => x === '') === Object.values(config)) {
    //Config not set up
}

app.use(express.json());
app.use(express.static('public'));

app.listen(port, () => console.log('Settings server listening on localhost:' + port.toString()));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/guide', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/api/command', (req, res) => {
    // executeAsBot(req.body.command);
});

app.post('/api/config', (req, res) => {
    fs.writeFileSync('./config.json', req.body.config);
})