const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session= require('express-session');
const KnexSessionStore=require('connect-session-knex')(session);

const restrict = require('./middleware/restricted.js');

const authRouter = require('./auth/auth-router.js');
const jokesRouter = require('./jokes/jokes-router.js');

const server = express();

const sessionConfig = {
    name:'pikachu',
    secret:'keep it secret',//crypto sign the cookie
    cookie:{
      //how old could cookie be before its considered expired
      maxAge: 60 * 60 * 1000,
      secure:false,
      httpOnly:true
    },
    resave:false,//avoids recreating sessions that havn't changed
    saveUninitialized:false, //to comply with GDPR laws
    //make the configured instance of knexsession to use knex to store session data in db
    store:new KnexSessionStore({
      //pass it configured instance of knex
      knex: require('../data/dbConfig'),
      tablename: 'sessions',
      sidfieldname:'sid',
      createtable:true,//create it automaticly if session table doesn't exist
      clearInterval:60 * 60 * 1000 //in ms
    })
  }

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(session(sessionConfig));
server.use('/api/auth', authRouter);
server.use('/api/jokes', restrict, jokesRouter); // only logged-in users should have access!

server.use((error,req,res,next)=>{
    res.status(500).json(error)
    next()
})
module.exports = server;
