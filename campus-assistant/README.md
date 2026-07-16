This is a pupeeter script that will auto login to Student Portal and then try to take the section you want. It will keep trying until it finds an open section. It will then send you an email to let you know that it has found an open section.

### How to use
Run the following command from the root of the project, it will run the script in a docker container.
```sh
docker run -d --init --cap-add=SYS_ADMIN --rm ghcr.io/puppeteer/puppeteer:latest node -e "$(cat index.js)"
```