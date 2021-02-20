module.exports={validateCredential,validateRegister}
const {findByUsername}=require('../auth/auth-model');

function validateCredential(req,res,next){
    // if(!req.body.username || !req.body.password){
    if (req.body.username && req.body.password && typeof req.body.password === "string")
    {
       next()
    }else {
        //if the req is missing username or password in the body
        res.status(400).json({message:"username and password required"})
    }
}

async function validateRegister(req,res,next){
    //check if username exists already in the users db
    const user= await findByUsername(req.body.username);
    //username taken / user exists
    if(user.length!==0){
        res.status(400).json({message:"username taken"})
    }else{
        next()
    }
}
