const mongoCollections = require('../config/mongoCollections');
const companies = mongoCollections.company;
const helper = require('../helper');
const users = mongoCollections.user;
const {ObjectId} = require('mongodb');
const firebaseAdmin = require('../config/firebase-config');
const service =  require("../service");
const projectData = require('./project')

const getUserById = async (id) =>{
    id = helper.common.isValidId(id);
    const userCollection = await users();
    const user = await userCollection.findOne({_id : new ObjectId(id)});
    user._id = user._id.toString();
    return user;
}

const getUserByEmail = async (email) =>{
  email = helper.common.isValidEmail(email);
  const userCollection = await users();
  const user = await userCollection.findOne({email : email});
  if(!user) throw {status:404,error:'No user with that email'} 
  return user;
}

const updateUser = async (userId,body) =>{
    for(let field in body){
        switch(field)
        {
          case "name":
            body.name = helper.common.isValidString(body.name,'name');
            break;
          case "role":
            body.role = helper.user.isValidRole(body.role);
            break;
          case "accessProjects":
            body.accessProjects = helper.user.isValidAccessProjects(body.accessProjects);
            break;
          default:
            throw { status: 400, error: `Invalid key - ${field}` };
        }
      }
    let userInDb = await getUserById(userId);
    if(!userInDb) throw {status:400,error:'No user with that ID'}  
    if(body.accessProjects){
        body.accessProjects = [...userInDb.accessProjects,...body.accessProjects];
        body.accessProjects.forEach(async (p) => await projectData.getProjectById(p))
    }

    const userCollection = await users();
    const updateInfo = await userCollection.updateMany({_id : new ObjectId(userId)}, {$set : body});
    if (updateInfo.modifiedCount === 0) {
      throw {status:500 , error : 'Could not update user successfully'};
    }

    return await getUserById(userId);
}

const getCompanyById = async (id) => {
  id = helper.common.isValidId(id);

  const companyCollection = await companies();
  const company = await companyCollection.findOne({_id: new ObjectId(id)},{projection:{hashedPassword:0}});
  if (company === null) throw {status:"404",error:'No company with that id'};
  company['_id']=company['_id'].toString()
  return company;
};

const createUser = async(companyId,email,name,role) => {
    companyId = helper.common.isValidId(companyId);
    email = helper.common.isValidEmail(email);
    name = helper.common.isValidString(name,'user name');
    role = helper.user.isValidRole(role);
    
    await getCompanyById(companyId);

  if(await isUserEmailInDb(email)) throw {status:400,error:'A user account already exists with this email'};

    let newUser = {
      companyId,
      email,
      name,
      role,
      accessProjects:[]
    }
  const userCollection = await users(); 
  const insertInfo = await userCollection.insertOne(newUser);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
  throw {status:"400",error:'Could not add User'};
  
  const newUserId = insertInfo.insertedId.toString();
  const user = await getUserById(newUserId);
  if(newUser.role != "SUPER-ADMIN"){
    const token = await firebaseAdmin.auth().createCustomToken(newUser.email);

    service.email.sendPasswordResetLinkEmail({email:newUser.email, token});
  }
  return user;

}
const isUserEmailInDb = async(email) => {
    email=helper.common.isValidEmail(email).toLowerCase();
  
    const userCollection = await users();
    const userInDb = await userCollection.findOne({email:email});
    if (userInDb === null) return false;
    return true;  
  }

const getUsersByCompanyId = async(companyId) => {
    companyId = helper.common.isValidId(companyId);
    //check if a company exists with that id
    const userCollection = await users()
    const companyUsers = await userCollection.find({companyId: companyId}).toArray();
    if (companyUsers === null) throw {status:"404",error:'No users in that company'};
    for(let tempUser of companyUsers)
    tempUser['_id']=tempUser['_id'].toString()
    return companyUsers;
}

module.exports = {
    getUserById,
    getUserByEmail,
    updateUser,
    createUser,
    getUsersByCompanyId,
    isUserEmailInDb,
    getUserByEmail
};