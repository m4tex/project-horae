"use strict";

let mouseCircle;

const transitionDuration = 1000;

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

let paletteIndex = 0;

window.onload = () => {
    document.body.style.backgroundColor = colorPalette[paletteIndex].bg;

    mouseCircle = document.createElement("div");
    mouseCircle.className = 'mouseFollower';
    mouseCircle.style.backgroundColor = colorPalette[paletteIndex].circle;
    mouseCircle.style.zIndex = '2';

    document.body.appendChild(mouseCircle);

    function followMouse(e) {
        let offset = mouseCircle.getBoundingClientRect().width/2;
        mouseCircle.style.left = e.pageX - offset + 'px';
        mouseCircle.style.top = e.pageY - offset + 'px';
    }

    document.addEventListener('mousemove', followMouse);

    function expandAndColor(e) {
        let expander = mouseCircle.cloneNode();
        expander.style.top = mouseCircle.style.top;
        expander.style.left = mouseCircle.style.left;
        expander.style.transitionDuration = transitionDuration + 'ms';
        expander.style.zIndex = '0';

        document.body.appendChild(expander);
        expander.style.scale = (Math.sqrt(window.innerWidth*window.innerWidth + window.innerHeight*window.innerHeight)*2)/expander.getBoundingClientRect().width + '';
        if (++paletteIndex >= colorPalette.length) {
            paletteIndex = 0;
        }
        mouseCircle.style.backgroundColor = colorPalette[paletteIndex].circle;

        setTimeout(() => {
            document.body.style.backgroundColor = colorPalette[paletteIndex].bg;
            expander.remove();
        }, transitionDuration);
    }

    document.addEventListener('mousedown', expandAndColor);
}