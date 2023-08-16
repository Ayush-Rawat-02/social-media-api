# social-media-api

#setup
- npm install
- create .env file and add environment variables - PORT, MONGO_URI and JWT_SECRET
- Now run the app using npm start or node index.js

To run the app : npm start / node index.js
To run the test cases : npm test
To create a docker image and run it : docker compose up

#endpoints
  POST : 
- /api/authenticate - to authenticate the user and return jwt token   (INPUT : Email, Password)
- /api/follow/{id} - to follow a user
- /api/unfollow/{id} - to unfollow the user
- /api/posts - to create a new post                                   (INPUT: Title, Description)
- /api/like/{id} - to like a post with {id}
- /api/unlike/{id} - to unlike a post with {id}
- /api/comment/{id} - to comment on a post with {id}                  (INPUT: Comment)
  GET:
- /api/user - to get the details of authenticated user
- /api/posts/{id} - to get post with {id}
- /api/all_posts - to get all posts of the authenticated user
  DELETE:
-/api/posts/{id} - to delete post having {id}

#additional endpoint
-/api/create - to create a new user

- All endpoints are protected from unauthorized access , except for create, authenticate and GET:/api/posts/{id} which are public endpoints
- All protected endpoints require Bearer Token(JWT) in the authorization header.


# Technology used : NodeJS, MongoDB
# Framework used : ExpressJs
# Dependencies : express, bcryptjs, jsonwebtoken, mongoose, chai, chai-http, mocha, dotenv, cors, body-parser, nodemon
