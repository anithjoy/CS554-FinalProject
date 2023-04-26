const express = require('express');
const router = express.Router();
const data = require('../data');
const helper = require('../helper')
const xss = require('xss');

router
 .route('/')
 .get(async (req, res) => {
  try{  
    let users = await data.user.getUsersByCompanyId(req.user.companyId);
    if(users){
      res.json(users);
    } else throw {status:401,error:'Could not create user'};
  }catch(e){
    if(typeof e !== 'object' || !('status' in e))
    res.status(500).json("Internal server error");
  else
    res.status(parseInt(e.status)).json(e.error);
  return;
  }  
 })
 .post(async (req, res) => {
  try{
    const bodyData = req.body;
    for(let i in bodyData)
      bodyData[i]=xss(bodyData[i])
    bodyData.email=helper.common.isValidEmail(bodyData.email);
    bodyData.name=helper.common.isValidString(bodyData.name, 'user name');
    bodyData.role=helper.user.isValidRole(bodyData.role);
        
    let users = await data.user.createUser(req.user.companyId,bodyData.email,bodyData.name,bodyData.role);
    if(users){
      res.json(users);
    } else throw {status:401,error:'Could not create user'};
  }catch(e){
    if(typeof e !== 'object' || !('status' in e))
    res.status(500).json("Internal server error");
  else
    res.status(parseInt(e.status)).json(e.error);
  return;
  }  
 })
//Anyone can pickup this
router
  .route('/:userId')
  .get(async (req, res) => {
    try {
      req.params.userId = helper.common.isValidId(req.params.userId);
    } catch (e) {
        res.status(e.status).json(e.error);
      return;
    }
    try{
        let user = await data.user.getUserById(req.params.userId);
        res.json(user);
    }catch(e){
        res.status(e.status).json(e.error);
      return;
    }

  })
  .patch(async (req, res) => {
    try{
        let body = req.body;
        for(let field in body){
          switch(field)
          {
            case "name":
              body.name = helper.common.isValidString(body.name,'name');
              break;
            case "role":
              body.role = helper.user.isValidRole(body.role);
              break;
            case "password":
              body.password = helper.common.isValidPassword(body.password);
              break;
            case "accessProjects":
              body.accessProjects = helper.user.isValidAccessProjects(body.accessProjects);
              break;
            default:
              throw { status: 400, error: `Invalid key - ${field}` };
          }
        }

        const newUser = await data.user.updateUser(req.params.userId,body);
        res.json(newUser);
    }catch(e){
        res.status(e.status).json(e.error);
        return;
    }

    })

module.exports = router;