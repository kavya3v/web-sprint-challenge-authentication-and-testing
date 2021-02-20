const jwt=require('jsonwebtoken');
const secrets= require('../../config/secret');

module.exports = (req, res, next) => {
  //restricted function - to verify the token from req!!!!
  //grab the token from req header - to be in the Authorization token
  const token=req.headers?.authorization?.split(" ")[1] ?? req.headers?.authorization; //gets rid of bearer space using split / or handle without bearer

  if(token){
    //verify against the secret
    jwt.verify(token,secrets.jwtSecret,(err,decodedToken)=>{
      if(err){
        //invalid or expired token
        res.status(401).json({message:"token invalid"})
      }else{//authorized user! here
        //save the decoded token in request - for other functions
        req.decodedJWT=decodedToken;
        next()
      }
   })
  }else{ 
    //missing token in authorization header
    res.status(401).json({message: "token required"})   
   }
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
