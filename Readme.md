# Secure User Authentication System

In this assignment of secure authentication system I have implemented these features:

### User Registration:
- Users can create an account by providing necessary information (fullname, email, password).
- Store user data in in MongoDB after encrypting user sensitive information.
- Server side data validation to ensure data integrity.

### User Login:
- Users can log in using their credentials (email and password).
- Upon successful login, the backend generates a JSON Web Token (JWT) containing relevant user information .
- The logged in user can access the protected pages after refreshing the token.

### Security:
- Security against Xss and injection using express-validator.


## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)

## Getting Started (Project Setup)
- In order to get started with the application your system require
    - Node.js
    - VSCode or any modern code editor
    
- You can downlod the above mentioned from their official websites.

### Prerequisites

- Node.js       (v20.9.0)
- npm           (10.1.0)
- MongoDB       (Atlas or can use compass as well if requirement is to host db locally.)

### Installation

A step-by-step guide on how to get the project running on a local machine.

1. Clone the git repo
2. Open the folder with any modern code editor.
3. Change the directory to ASSIGNMENT
   ```
   cd ASSIGNMENT
   ```
4. Install the dependencies
    ```
    npm install
    ```
5. Start the server
    ```
    npm run dev
    ```

### Usage 

Now you can access the api endponts using postman (or similar tools) in order to serve their purpose.

- User specific API endpoints:
    ```
    POST /api/v1/users/register         - to regsiter a user
    POST /api/v1/users/login            - for user login
    POST /api/v1/users/logout           - to logout a user
    POST /api/v1/users/refresh-token    - to issue a new acces token
    GET  /api/v1/users/current-user     - to fetch current user
    ```

### Directory Structure

    ```
    user-auth/
    │               
    │── public/uploads
    └── src/
        ├── config/
        ├── controllers/
        ├── middlewares/
        ├── models/
        ├── routers/
        ├── utils/
        ├── app.js
        ├── constants.js
        |── index.js
        └── README.md
    ```
