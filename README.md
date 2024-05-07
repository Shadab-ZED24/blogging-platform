# Blogging Platform API

Welcome to the Blogging Platform API! This API provides endpoints to manage blog posts and users for a simple blogging platform.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Features

- Create, read, update, and delete blog posts
- Register and authenticate users
- Add comments to blog posts
- Pagination for blog posts
- Unit tests for API endpoints

## Prerequisites

Before you can run the application, ensure you have the following installed:

- Node.js (v14 or higher)
- npm (Node Package Manager)
- MongoDB (Make sure MongoDB server is running locally or accessible remotely)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/Shadab-ZED24/blogging-platform.git
   ```

2. Navigate to the project directory:

   ```bash
   cd blogging-platform
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:

   Modify the `.env` file with your MongoDB connection URI and any other necessary environment variables.

## Running the Application

To start the API server, run the following command:

```bash
npm start
```

The server will start running on `http://localhost:3000` by default (or the port specified in the `.env` file).



This command will execute the unit tests using the Mocha test framework and generate a report.

## API Documentation

For API documentation and usage examples, refer to the `API.md` file in the repository.

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines on how to contribute to this project.

## License

This project is licensed under the [MIT License](LICENSE).

