"use strict";

window.addEventListener('load', async () => {
    document.forms[0].addEventListener('submit', handleAuthSubmission)
});

function handleAnimationSwitch(value) {
    !value ? rippleCircleFollowerInit() : disableRippleCircle();
}

async function handleAuthSubmission(e) {
    e.preventDefault();

    let data = {
        user: e.target.children[0].children[0].value,
        pword: e.target.children[1].children[0].value
    }
    // let guard = e.target.children[2].children[0].value;

    await axios.post('http://localhost:420/api/config', data);
    let res = await axios.get('http://localhost:420/api/auth');
    let authText;

    if (res.hasOwnProperty("ERR")) {
        switch (res.ERR) {
            case 'AUTH_FAILED':
                authText = 'Failed to authenticate, make sure your credentials are correct and try again.';
                break;
            case 'AUTH_UNSUPPORTED' :
                authText = 'Couldn\'t authenticate, there is only support for Steam Guard verification'
                break;
            default:
                authText = 'Unexpected error occured, check the terminal the bot is running on and report the error to the creator'
                break;
        }
        console.log('attributt tiem')
        document.getElementsByClassName('auth-msg')[0].setAttribute('visible', 'true');
        document.getElementsByClassName('auth-msg')[0].textContent = authText;
    }
}
