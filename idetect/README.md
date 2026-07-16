### IDetect - National ID Scanner (OCR)

Currently the National ID card is used as the primary identification in Bangladesh, and in every place businesses are required to collect information of the National ID card from a photocopy of the card. Right now it's being done manually which is very time consuming and error prone. The goal of this project is to automate the process of collecting information from the National ID card.

#### Problem Domain & Motivations

- To automate the process of collecting information from the National ID card.
- To reduce the time and effort of the businesses.
- To reduce the error rate of the information collection.

#### Objectives/Aims

- To create a suit of tools to automate the process of collecting information from the National ID card.
- There will be desktop applications, web api and mobile applications.
- The desktop application will be used by the businesses to collect information from the National ID card and by the trainer to train the model.
- The web api will be the central point of the whole system for the desktop and mobile client.

#### Tools & Technologies

- Java as the main programming language.
- Spring Boot as the web framework.
- OpenCV (or another image processing library) for image processing.
- Tesseract for OCR.
- Swing for the desktop application.
- Java as the language for the mobile application.
- Android Studio as the IDE for the mobile application.
- SQL Server as the database.

#### Conclusion

This project will be a great help for the businesses and the government. It will reduce the time and effort of the businesses and will reduce the error rate of the information collection. It will also help the government to collect information from the National ID card.

## Getting Started

#### Running the project

2. From root directory:

```
$ ./gradlew installDist
```

Running Android App

```
$ ./../../gradlew installDebug
```

This creates the scripts `idetect-grpc-server`, `idetect-grpc-client`, in the
`build/install/idetect/bin/` directory that run the project. Client project requires the server to be running.

```
$ ./build/install/idetect/bin/idetect-grpc-server
```

And in a different terminal window run:

```
$ ./build/install/idetect/bin/idetect-grpc-client
```
