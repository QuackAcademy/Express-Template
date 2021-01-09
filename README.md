# QuackAcademy Express Template

This is a turn-key ExpressJS repo, set up with KnexJS/PostgreSQL, users/authentication routers and error middleware.

You can use this to quickly launch an Express backend or to follow along with the deployment tutorials on QuackAcademy listed below.

## Deployment Tutorial Links
* [Heroku](https://www.quackacademy.com/curriculum/backend/09a-heroku)
* [AWS](https://www.quackacademy.com/curriculum/backend/09b-aws)
* [GCP](https://www.quackacademy.com/curriculum/backend/09c-gcp)

## Documentation:
[Endpoints](https://github.com//QuackAcademy/Express-Template/blob/master/Endpoints.md)

## Local deployment/repo specific instructions

Clone/fork/download the app, then install the dependencies by running:
```js
npm i
```
We'll be using nodemon to run the server locally- it restarts automatically on changes to files.
```js
npm run server
```
The included file zRunServer.sh will open a new terminal and run this command on double click.

### Environment Variables
These variables need to be defined in order for the program to function successfully.

If working locally, create a file called .env in the root folder. 

You'll store variables like so: //image?

Environment variables are secret and should never be pushed to github. 

Ensure that *.env is listed in your .gitignore file to prevent this.

These environment variables need updating for the project to function:
* process.env.JWT_SECRET- this is the secret that your tokens get encoded/decoded with.
* process.env.topSecretCode- this is used as a way to have 'developer only' endpoints, like requiring it when calling error-router endpoints.
These are optional:
* process.env.discordUrl- add this if you want the webhooks included in utils.js and used in the error middleware to function.
* process.env.slackUrl- add this if you want the webhooks included in utils.js and used in the error middleware to function.

### Creating and seeding the database
To create a local sqlite3 database, install knex:
```js
npm install -g knex
```
And then run:
```js
knex migrate:latest
```
You can also use npx to run the command without installing knex:
```js
npx knex migrate:latest
```
Now fill the database with seed data:
```js
knex seed:run
```

### Testing functionality
Let's call some endpoints with Insomnia (Or Postman) to make sure everything is working correctly.

The server should be running on port 8018. 

Log in using http://localhost:8018/api/auth/login, credentials "username": "testuser1", "password":, "pass"
//image
This will return a JWT we will use to authenticate the next call.

Add your token to your headers as shown below:
//image

Call get http://localhost:8018/api/users/user/all and you should receive a response with the three seeded users.
//image

If you were able to get this far everything is setup correctly and functioning as expected.