"use strict";

let botConfig;

window.addEventListener('load', async () => {
    botConfig = await (await fetch('http://localhost:420/api/config')).json();
});

function handleAnimationSwitch(value) {
    !value ? rippleCircleFollowerInit() : disableRippleCircle();
}