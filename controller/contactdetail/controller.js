const JWTPayload = require("../../model/authentication");
const User = require("../../model/user");
const Joi = require('joi');
function createContactDetail(req,resp){
    const isValidUser =  JWTPayload.isValidUser(req,resp)
    if(!isValidUser){
        return "unauthorized access"
    }
    const schema = Joi.object({
        userName : Joi.string().min(3).required(),
        fullName : Joi.string().min(3).required(),
        type     : Joi.string().min(3).required(),
        value    : Joi.string().min(3).required()
    })
    const {error,val} = schema.validate(req.body)
    if(error){
        resp.status(400).send(error.details[0].message);
        return;
    }
   

    const userName = req.body.userName
    const fullName = req.body.fullName
    const type = req.body.type
    const value = req.body.value
   console.log( userName,fullName,type,value)
    let [UserExist,isactive,index] = User.findUser(userName)
    if(!UserExist)
    {
        resp.status(404).send("User not Found!!!");
        return;
    }

    let [ContactExist,iscontactactive,contactindex] = User.allUsers[index].findContact(fullName);
    if(!ContactExist)
    {
        resp.status(404).send("Contact doesn't Exist")
        return;
    }
  
    let [isContactDetailadded,message] = User.allUsers[index].createContactDetails(fullName,type,value)
    if(!isContactDetailadded){
        resp.status(404).send(message)
        return;
    }
    resp.status(200).send("detail added successfully!!!");
}

module.exports = {createContactDetail};