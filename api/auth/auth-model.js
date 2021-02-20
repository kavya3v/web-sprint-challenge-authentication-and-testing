const dbUsers=require('../../data/dbConfig');

module.exports={findByUsername,addUser,getByUserId}

async function findByUsername(username){
    const user=await dbUsers("users").where('username',username).first();
    return user; 
}

async function getByUserId(userId){
    const user=await dbUsers("users").where('id',userId)
    return user; 
}

async function addUser(credentials){
    const [userId]=await dbUsers("users").insert(credentials);
    const user= await getByUserId(userId);
    return user;
}