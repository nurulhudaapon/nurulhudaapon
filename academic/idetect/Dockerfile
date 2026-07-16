FROM openjdk:11
VOLUME /tmp
ARG JAVA_OPTS
ENV JAVA_OPTS=$JAVA_OPTS

RUN apt-get -y install apt-transport-https
RUN echo "deb https://notesalexp.org/tesseract-ocr5/$(lsb_release -cs)/$(lsb_release -cs) main" | tee /etc/apt/sources.list.d/notesalexp.list > /dev/null

# RUN apt-get update -oAcquire::AllowInsecureRepositories=true
# RUN apt-get -y install notesalexp-keyring -oAcquire::AllowInsecureRepositories=true
RUN wget -O - https://notesalexp.org/debian/alexp_key.asc | apt-key add -

# RUN apt-get update && apt-get -y install tesseract-ocr

# Copy Gradle files first to leverage Docker cache
COPY gradlew /app/
COPY gradle /app/gradle

# Download dependencies
WORKDIR /app
RUN ./gradlew --version

# Copy the rest of the source code
COPY . /app

# Build the project
WORKDIR /app
RUN ./gradlew installDist

# Expose port and set the startup command to run your binary.
EXPOSE 5051

ENTRYPOINT exec ./build/install/idetect/bin/hello-world-server
