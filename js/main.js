
const fadeOutEffect = () => {
    const loaded = () => {document.querySelector('#target').style.display = "none";};
    const fadeTarget = document.querySelector('#target');
    const fadeEffect = setInterval(function () {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.1;
        } else {
            clearInterval(fadeEffect);
            loaded();
        }
    }, 60);
};
