
// Get the Sidebar
var mySidebar = document.getElementById("mySidebar");

// Get the DIV with overlay effect
var overlayBg = document.getElementById("myOverlay");

// Toggle between showing and hiding the sidebar, and add overlay effect
function w3_open() {
    if (mySidebar.style.display === 'block') {
        mySidebar.style.display = 'none';
        overlayBg.style.display = "none";
    } else {
        mySidebar.style.display = 'block';
        overlayBg.style.display = "block";
    }
}

// Close the sidebar with the close button
function w3_close() {
    mySidebar.style.display = "none";
    overlayBg.style.display = "none";
}
function changeTo(c) {
    const container = document.getElementById('content');
    w3_close();
    container.innerHTML = '<div id="loaderContainer" style="position: fixed;z-index: 99999;top: 0;left: 0;width: 100%;height: 100%;background-color: #ebebeb;display: flex;justify-content: center;align-items: center;background: rgba(0, 0, 0, .5);"><div class="loader"></div></div>'
    container.innerHTML = `<iframe width="100%" height="873px" frameborder='no' src=/${c}>`
        
}
