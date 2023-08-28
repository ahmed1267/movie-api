
# NestJS Movie API

Welcome to the NestJS Movie API project! This API allows you to manage movies and genres through CRUD operations. You can list movies, add movies, update movies, delete movies, list genres, add genres, delete genres, and search for movies based on title or genre.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Starting the Server](#starting-the-server)
  - [API Endpoints](#api-endpoints)
- [Postman Collection](#postman-collection)

## Getting Started

### Prerequisites

Before running the application, make sure you have the following installed:

- Node.js (https://nodejs.org/)
- npm (Node Package Manager)
- MonogDB (https://www.mongodb.com/)

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/ahmed1267/movie-api
   ```

2. Navigate to the project directory:

   ```bash
   cd movie-api
   ```

3. Install the dependencies:

   ```bash
   $ npm i --save class-validator class-transformer
   ```

## Usage

### Starting the Server

To start the server, run the following command:

```bash
npm run start:dev
```

The server will start running at http://localhost:3000.

### API Endpoints

The API endpoints are as follows:

- List Movies: GET http://localhost:3000/movies
- Get Movie: GET http://localhost:3000/movie/:id
- Add Movie: POST http://localhost:3000/movies
- Update Movie: PUT http://localhost:3000/movies/:id
- Delete Movie: DELETE http://localhost:3000/movies/:id
- Search Movies: GET http://localhost:3000/movies/type=example&keyword=example
- List Genres: GET http://localhost:3000/genres
- Add Genre: POST http://localhost:3000/genres
- Delete Genre: DELETE http://localhost:3000/genres/:id

## Postman Collection

For easy testing of API endpoints, you can import the provided Postman collection file (`movie-api.postman_collection.json`) into Postman or any other API testing tool.

## Bonus Tasks

- Pagination: The API supports pagination for the movies list. You can specify the `page` and `limit` query parameters to retrieve specific subsets of movies.
- Middleware: A request logging middleware has been implemented to log incoming requests.
- Data Validation and Error Handling: Data validation and error handling are implemented to ensure proper handling of requests and responses.

Feel free to explore the project!

---

Happy coding! If you have any questions or need further assistance, please don't hesitate to ask.
