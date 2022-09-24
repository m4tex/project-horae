window.addEventListener('load', rippleCircleFollowerInit);

//Colors picked from http://colorhunt.co
const colorPalette = [
    { circle: '#533483', bg: '#16213E' },
    { circle: '#42032C', bg: '#533483' },
    { circle: '#D36B00', bg: '#42032C' },
    { circle: '#850E35', bg: '#D36B00' },
    { circle: '#ECC5FB', bg: '#850E35' },
    { circle: '#FAF4B7', bg: '#ECC5FB' },
    { circle: '#EC7272', bg: '#FAF4B7' },
    { circle: '#6FEDD6', bg: '#EC7272' },
    { circle: '#16213E', bg: '#6FEDD6' },
];

// const colorPalette = [
//     { circle: '#8E806A', bg: '#FFE6BC' },
//     { circle: '#C3B091', bg: '#8E806A' },
//     { circle: '#E4CDA7', bg: '#C3B091' },
//     { circle: '#FFE6BC', bg: '#E4CDA7' },
// ];

const circleAnimDuration = 1000;

let paletteIndex = 0;
let mouseCircle;

function rippleCircleFollowerInit() {
    createFollowerCircle();

    document.addEventListener('mousemove', followMouse);
    document.addEventListener('mousedown', expandAndColor);
}

function createFollowerCircle() {
    document.body.style.backgroundColor = colorPalette[paletteIndex].bg;

    mouseCircle = document.createElement("div");
    mouseCircle.className = 'mouseFollower';
    mouseCircle.style.backgroundColor = colorPalette[paletteIndex].circle;
    mouseCircle.style.backgroundColor
    mouseCircle.style.zIndex = '25';
    mouseCircle.style.opacity = '0.3';
    mouseCircle.style.pointerEvents = 'none';

    document.body.appendChild(mouseCircle);
}

function expandAndColor() {
    //Duplicate mouse circle
    let expander = mouseCircle.cloneNode();
    expander.style.top = mouseCircle.style.top;
    expander.style.left = mouseCircle.style.left;
    expander.style.zIndex = '0';
    expander.style.boxShadow = 'none';
    document.body.appendChild(expander);

    //Animation vars
    let start;
    const endScale = (Math.sqrt(window.innerWidth*window.innerWidth + window.innerHeight*window.innerHeight)*2)/expander.getBoundingClientRect().width;

    //Animation frame
    function animationStep(timestamp) {
        if(start === undefined) start = timestamp;

        const elapsed = timestamp - start;

        let scale = easeOutQuad(elapsed, 1, endScale, circleAnimDuration);

        expander.style.transform = `scale(${scale})`;

        if(elapsed < circleAnimDuration) {
            window.requestAnimationFrame(animationStep);
        } else {
            expander.remove();
            document.body.style.backgroundColor = colorPalette[paletteIndex].bg;
        }
    }

    //Sets paletteIndex to 0 when it exceeds the array length of colorPalette
    paletteIndex = +(paletteIndex + 1 < colorPalette.length) * (paletteIndex + 1);

    mouseCircle.style.backgroundColor = colorPalette[paletteIndex].circle;

    //Triggers the animation
    window.requestAnimationFrame(animationStep);
}

function followMouse(e) {
    let offset = mouseCircle.getBoundingClientRect().width/2;
    mouseCircle.style.left = e.pageX - offset + 'px';
    mouseCircle.style.top = e.pageY - offset + 'px';
}

//Ease out function taken from: https://spicyyoghurt.com/tools/easing-functions
function easeOutQuad (timeDelta, startVal, endValDelta, duration) {
    return -endValDelta * (timeDelta /= duration) * (timeDelta - 2) + startVal;
}

function disableRippleCircle() {
    mouseCircle.remove();
    document.removeEventListener('mousemove', followMouse);
    document.removeEventListener('mousedown', expandAndColor);
}