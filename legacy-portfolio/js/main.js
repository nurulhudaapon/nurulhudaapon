
const fadeOutEffect = (fadeTime) => {
    let target = document.querySelector('#loader');
    let loaded = () => {target.style.display = "none"};
    
    let fadeEffect = setInterval(function () {
        if (!target.style.opacity) {
            target.style.opacity = 1;
        }
        if (target.style.opacity > 0) {
            target.style.opacity -= 0.1;
        } else {
            clearInterval(fadeEffect);
            loaded();
        }
    }, fadeTime);
};
document.querySelector('body').onload = fadeOutEffect(20);