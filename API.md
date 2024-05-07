# Blogging Platform API Documentation

## Introduction

Welcome to the Blogging Platform API documentation. This API provides endpoints to manage blog posts and users for a simple blogging platform.

## Authentication

The API requires authentication using JSON Web Tokens (JWT). To authenticate, you need to include a valid JWT token in the `Authorization` header of your HTTP requests.

## Endpoints

### 1. Login

- **URL:** `/login`
- **Method:** POST
- **Description:** Authenticates a user and generates a JWT token for authorization.
- **Request Body:**
  ```json
  {
    "username": "example_user",
    "password": "example_password"
  }
  ```
- **Response:**
  ```json
  {
    "status": true,
    "token": "generated_jwt_token"
  }
  ```

### 2. Add User

- **URL:** `/addUser`
- **Method:** POST
- **Description:** Registers a new user.
- **Request Body:**
  ```json
  {
    "username": "new_user",
    "password": "new_password",
    "role": "user_role"
  }
  ```
- **Response:**
  ```json
  {
    "status": true,
    "message": "User created successfully"
  }
  ```

### 3. Get All Posts

- **URL:** `/posts`
- **Method:** GET
- **Description:** Retrieves all posts.
- **Request Headers:** `Authorization: Bearer jwt_token`
- **Response:**
  ```json
  {
    "status": true,
    "data": [list_of_posts]
  }
  ```

### 4. Add Post

- **URL:** `/addPost`
- **Method:** POST
- **Description:** Adds a new post.
- **Request Body:**
  ```json
  {
    "title": "Post Title",
    "content": "Post Content"
  }
  ```
- **Request Headers:** `Authorization: Bearer jwt_token`
- **Response:**
  ```json
  {
    "status": true,
    "message": "Post created successfully"
  }
  ```

### 5. Get Post by ID

- **URL:** `/retrieveById/:id`
- **Method:** GET
- **Description:** Retrieves a post by its ID.
- **Request Parameters:** `id` (Post ID)
- **Request Headers:** `Authorization: Bearer jwt_token`
- **Response:**
  ```json
  {
    "status": true,
    "data": {post_data}
  }
  ```

### 6. Delete Post by ID

- **URL:** `/removeById/:id`
- **Method:** DELETE
- **Description:** Deletes a post by its ID.
- **Request Parameters:** `id` (Post ID)
- **Request Headers:** `Authorization: Bearer jwt_token`
- **Response:**
  ```json
  {
    "status": true,
    "message": "Post deleted successfully"
  }
  ```

### 7. Update Post by ID

- **URL:** `/updateById/:id`
- **Method:** PUT
- **Description:** Updates a post by its ID.
- **Request Parameters:** `id` (Post ID)
- **Request Body:** Updated post data
- **Request Headers:** `Authorization: Bearer jwt_token`
- **Response:**
  ```json
  {
    "status": true,
    "data": {updated_post_data},
    "message": "Post updated successfully"
  }
  ```

### 8. Filter Posts

- **URL:** `/filterPosts`
- **Method:** POST
- **Description:** Filters posts based on author or creation date.
- **Request Body:** Filter type and criteria
  ```json
  {
    "type": "author|creationDate",
    "author": "author_name",
    "creationDate": "YYYY-MM-DD"
  }
  ```
- **Request Headers:** `Authorization: Bearer jwt_token`
- **Response:**
  ```json
  {
    "status": true,
    "data": [filtered_posts]
  }
  ```

### 9. Paginate Posts

- **URL:** `/postsPagination`
- **Method:** GET
- **Description:** Retrieves paginated posts.
- **Query Parameters:** `page` (Page number), `limit` (Number of posts per page)
- **Request Headers:** `Authorization: Bearer jwt_token`
- **Response:**
  ```json
  {
    "status": true,
    "data": [paginated_posts]
  }
  ```

## Conclusion

This concludes the API documentation for the Blogging Platform API. For any further queries or assistance, please refer to the [Contributing](#contributing) section in the README file.

