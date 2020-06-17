# auth-microservice
A microservice that authenticates various applications

## Overview
This project is a dockerized micro-service for the authentication of applications  written in NodeJS

## Getting Started
- git clone or fork [this repo](https://github.com/neymarjimoh/auth-microservice.git)
- cd auth-micro
- install dependencies, `yarn or npm install`
- Run the server `npm run devStart` or `yarn devStart`

## Docker

To run the code:
- the Docker daemon and the docker-compose tool must be running on localhost.
- using docker toolbox instead?, the docker daemon must be running on the docker-machine ip

Run `docker-machine ip` to see the ip

Run `docker-compose --version` to see if docker-compose is installed

Run `docker-compose build` in the root directory to build the images and run `docker-compose up` to start the services.
