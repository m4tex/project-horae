"use strict";

let botConfig;

window.addEventListener('load', async () => {
    botConfig = await (await fetch('http://localhost:420/api/config')).json();

    document.forms[0].addEventListener('submit', handleAuthSubmission)
});

function handleAnimationSwitch(value) {
    !value ? rippleCircleFollowerInit() : disableRippleCircle();
}

async function handleAuthSubmission(e) {
    e.preventDefault();


    let data = {
        login: e.target.children[0].value,
        pword: e.target.children[1].value
    }
    // let guard = e.target.children[2].value;
    console.log(data);

    axios.post('http://localhost:420/api/auth', data);
}
