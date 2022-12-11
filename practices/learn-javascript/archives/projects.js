let projects = [
    {
        label: 'JS-1',
        name: 'Background Generator',
        src: 'background-generator/index.html',
        version: 'V1'
    },
    {
        label: 'JS-1',
        name: 'Background Generator',
        src: 'background-generator/index.html',
        version: 'V1'
    },
    {
        label: 'JS-1',
        name: 'Background Generator',
        src: 'background-generator/index.html',
        version: 'V1'
    },
]















let projectContainer = document.getElementById('project-container');
let projectsContainer = document.getElementById('projects-container');

let projectTemplate = `
    <div id="project-container">
        <h3>JS-5:</h3>
        <a href="background-generator/index.html"><button id="js-5">Background Generator</button></a>
        <p>Version: <strong>V1</strong></p>
        <hr>
    </div>
`

for (let i=0; projects.length > i; i++ ) {
    projectsContainer.innerHTML += `
        <div id="project-${i+1}">
            <h3>${projects[i].label}:</h3>
            <a href="${projects[i].src}"><button id="${projects[i].toLowerCase}">${projects[i].name}</button></a>
            <p>Version: <strong>${projects[i].version}</strong></p>
            <hr>
        </div>
        `
}


