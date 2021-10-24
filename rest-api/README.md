# REST API
Web API with Create, Read, Update, Delete (CRUD) operations.

## Project Structure
* api
    * controllers: implements logic supporting CRUD operations
    * models: defines the database schema
    * routes: defines the API routes using functions from todoController.js
* config: contains db.js, which establishes the MongoDB connection
* server.js: point of entry

## API Endpoints
* `POST /todos`
* `GET /todos`
    * Gets all database entries
* `PUT /todo/:id`
* `DELETE /todo/:id`

## Getting Started
Run the following commands:
``` javascript
$ git clone https://github.com/allisonkwan/rest-api-hack-gt-8.git
$ npm install 
$ node server.js
