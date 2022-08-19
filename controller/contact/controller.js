const JWTPayload = require("../../model/authentication");
const User = require('../../model/user');
const Joi = require('joi');

function createContact(req,resp){
    const isValidUser =  JWTPayload.isValidUser(req,resp)
    if(!isValidUser){
        return;
    }

    const schema = Joi.object({
        userName  : Joi.string().min(3).required(),
        firstName : Joi.string().min(3).required(),
        lastName  : Joi.string().min(3).required()
    })
    const {error,value} = schema.validate(req.body)
    if(error){
        resp.status(400).send(error.details[0].message);
        return;
    }

    const {userName,firstName,lastName} = req.body;
    let [message,isActive,index] = User.findUser(userName);

    if(!message)
    {
        resp.status(300).send("User  does not Exist");
        return;
    }

    let [status,text,newcontact] = User.allUsers[index].createContact(firstName,lastName);

    if(newcontact==-1)
    {
        resp.status(504).send(text);
        return;
    }
    console.log(newcontact);
    resp.status(201).send("Contact Created");
    return;
}

function getallcontacts(req,resp){
    const isValidUser =  JWTPayload.isValidUser(req,resp)
    if(!isValidUser){
        return "No Access"
    }
    // const schema = Joi.object({
    //     userName: Joi.string().min(3).trim().required()
    // })
    // const {error,value} = schema.validate(req.body)
    // if(error){
    //     resp.status(400).send(error.details[0].message);
    //     return;
    // }

    const userName = req.body.userName;
    console.log(userName);
    let [message,isactive,index] = User.findUser(userName)
    if(!message){
        resp.status(404).send("User doesn't Exist");
       return;
    }

    resp.status(200).send(User.allUsers[index].contacts)
    return
}

function deleteUserContact(req,resp){
    const isValidUser =  JWTPayload.isValidUser(req,resp)
    if(!isValidUser){
        return "No Access"
    }
    const schema = Joi.object({
        userName  : Joi.string().min(3).required(),
        fullName : Joi.string().regex(/^[a-zA-Z]+ [a-zA-Z]+$/).min(3).required()
    })
    const {error,value} = schema.validate(req.body)
    if(error){
        resp.status(400).send(error.details[0].message);
        return;
    }

    let {userName,fullName} = req.body;
    
    let [message,isactive,index] = User.findUser(userName)

    if(!message)
    {
        resp.status(404).send("User doesn't Exist");
       return;
    }
    let [success,text] = User.allUsers[index].deleteContact(fullName);
    if(!success)
    {
        resp.status(504).send(text);
        return;
    }
    resp.status(200).send(text);
    return;
}

module.exports = {createContact,getallcontacts,deleteUserContact};