module.exports={validateCredential,validateRegister}
const {findByUsername}=require('../auth/auth-model');

function validateCredential(req,res,next){
   
    if(!req.body || !req.body.username || !req.body.password)
    {//if the req is missing username or password in the body
      res.status(400).json({message:"username and password required"})
    }else {
        next()
    }
}

async function validateRegister(req,res,next){
    //check if username exists already in the users db
    const user= await findByUsername(req.body.username);
    //username taken / user exists
    if(user){
        res.status(400).json({message:"username taken"})
    }else{
        next()
    }
}
