const router = require('express').Router();
const bcryptjs= require('bcryptjs');
const jwt= require('jsonwebtoken');
const { findByUsername } = require('./auth-model');
const secrets=require('../../config/secret');
const {validateCredential,
validateRegister}= require('../middleware/auth-middleware');
const {addUser}=require('./auth-model');

router.post('/register', validateCredential, validateRegister, async (req, res,next) => {
  const credentials=req.body;
  //if valid credentials
  //get rounds from env variable
  const rounds=process.env.BCRYPT_ROUNDS || 8;
  //password hash and set the value
  const hash=bcryptjs.hashSync(credentials.password,rounds);
  credentials.password=hash;
  try {
    //add user to db
    const [registeredUser]= await addUser(credentials);
    // const token=generateToken(registeredUser);
    res.status(201).json(registeredUser);
    //   res.status(201).json({message: "Register Success",data: registeredUser,token})
  } catch (err) {
    next(err)
  }
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', validateCredential, async (req,res,next) => {
  try {
    const {username,password}= req.body;
    const [user] = await findByUsername(username);
    //validate hashed password 
    if(user && bcryptjs.compareSync(password,user.password)){
      const token=generateToken(user);
      res.status(200).json({message:`welcome, ${user.username}`,token})
    }else{
      res.status(401).json({message:"invalid credentials"})
    }
  } catch (err) {
    next(err)
  }
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

function generateToken(user){
  const payload={
    subject:user.id,
    username:user.username,
  }
  const options={
    expiresIn:"1h"
  }
  //generate signature
  const secret=secrets.jwtSecret;
  return jwt.sign(payload,secret,options)
}

module.exports = router;
