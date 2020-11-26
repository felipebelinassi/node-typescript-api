# Surf Forecast API w/ NodeJS and TypeScript  
[![Actions Status](https://github.com/felipebelinassi/surf-forecast-api/workflows/Deploy%20Application/badge.svg)](https://github.com/felipebelinassi/surf-forecast-api/actions)

## About
This project was made for studying purposes, and it's based on the free course below, held by Waldemar Neto from Dev Lab.  

[![Waldemar Neto course playlist](https://i.ytimg.com/vi/W2ld5xRS3cY/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLAFA_8p2vChjGogMZLlGuyrFrPjiA)](https://www.youtube.com/playlist?list=PLz_YTBuxtxt6_Zf1h-qzNsvVt46H8ziKh "From zero to production: Learn to build a Node.JS API with TypeScript")  
*"From zero to production: Learn to build a Node.JS API with TypeScript"*  

## Stack used  
* NodeJS (>= 12.0.0)  
* TypeScript  
* Jest  
* Mongoose  
* GitHub Actions  

## Getting Started

* Clone the repository:  
```git clone https://github.com/felipebelinassi/node-typescript-api.git <project_name>```

* Install dependencies:  
```yarn``` or ```npm install```

* Build and run the project:  
```yarn start``` or ```npm start```

* Start MongoDB using Docker (optional):  
```docker-compose up -d```

* Run the project in development mode (using Nodemon):  
```yarn start:dev```or ```npm run start:dev```

* Run unit and functional tests:  
```yarn test``` or ```npm test```

## Database
As stated above, this API uses MongoDB as it's database, and requires it to be running before starting the server. You can create a free database using [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or run a local instance using [Docker](https://www.docker.com/). A docker-compose file has been aded to the project with a simple MongoDB instance. To start it locally run: ```docker-compose up -d```, and then your MongoDB instance will be running at *localhost:27017*.

## Documentation  
The documentation uses the OpenAPI 3.0 standard. You can access the API documentation using the ```/docs``` endpoint after running the project.

## Environment variables  
This project uses dotenv package to manage environment variables. To set your variables, create a .env file (or just rename the .example.env), which contains all the environments needed to run the application. All variables are **required**.

- *PORT* -> Port where the server will start (Heroku set this environment automatically).  
- *LOGGER_ENABLED* -> Flag to indicate if application will log messages using Pino logger.  
- *LOGGER_LEVEL* -> Level to log messages.  
- *MONGODB_URL* -> MongoDB connection url.  
- *JWT_SECRET_KEY* -> Secret value that JWT tokens should be signed with.  
- *STORM_GLASS_API_URL* -> Storm Glass API service base url.  
- *STORM_GLASS_API_TOKEN* -> Storm Glass service API token.  

## Deployment  
This project is currently deployed on Heroku. You can make some requests using the following base url:  
`https://belinassi-surf-forecast.herokuapp.com`
