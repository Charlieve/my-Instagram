'use strict';
require('dotenv').config();
const express = require('express');
const myDB = require('./connection.js');
const session = require('express-session');
const passport = require('passport');
const routes = require('./routes.js');
const cookieParser = require('cookie-parser');

const app = express();
const http = require('http').createServer(app);

const MongoStore = require('connect-mongo');
const URI = process.env.MONGO_URI;

//epxress-session setting
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false },
  key: 'express.sid',
  store: MongoStore.create({mongoUrl:URI})
}));



//passport-setting
app.use(passport.initialize());
app.use(passport.session());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


myDB(async client => {
  const DBUsers = await client.db('database').collection('users');
  const DBPosts = await client.db('database').collection('posts');
  const DBPostContents = await client.db('database').collection('postContents');

  routes(app, DBUsers, DBPosts, DBPostContents);
  
  
}).catch(e => {
  app.route('/').get((req, res) => {
    res.send('error final');
  });
});
// app.listen out here...

http.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port ' + 3000);
});

