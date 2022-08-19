const JWTPayload = require("../../model/authentication");
const User = require("../../model/user");
const Joi = require('joi');

async function createuser(req,resp,admin){
        const isValidAdmin =  JWTPayload.isValidAdmin(req,resp)
        if(!isValidAdmin){
            return;
        }
        const schema = Joi.object({
            
            firstName : Joi.string().min(3).required(),
            lastName  : Joi.string().min(3).required(),
            userName  : Joi.string().min(3).alphanum().required(),
            password  : Joi.string().min(3).required(),
            role      : Joi.string().min(3).required()

        })
        const {error,value} = schema.validate(req.body)
        if(error){
            resp.status(400).send(error.details[0].message);
            return;
        }
        let {firstName,lastName,userName ,password,role} = req.body;
        let [newUser,message] = await admin.createUser(firstName,lastName,userName,password,role);
        if(newUser == false )
        {
            resp.status(404).send(message)
            return
    
        }
        console.log(newUser);
        resp.status(201).send("User Created");
        return
}


function getuser(req,resp){
    const isValidAdmin =  JWTPayload.isValidAdmin(req,resp)
    if(!isValidAdmin){
        return
    }
    console.log(User.allUsers);
    resp.status(201).send(User.allUsers)
}

function updateuser(req,resp){
    const isValidAdmin =  JWTPayload.isValidAdmin(req,resp)
    if(!isValidAdmin){
        return;
    }
    const schema = Joi.object({
        userName : Joi.string().min(3).required(),
        property : Joi.string().min(3).required(),
        value    : Joi.string().min(3).required()
    })
    const {error,val} = schema.validate(req.body)
    if(error){
        resp.status(400).send(error.details[0].message);
        return;
    }
    let {userName,property,value} = req.body; 
    let [message,isactive,index] = User.findUser(userName)
    if(!message){
        resp.status(404).send("User doesn't exits")
        return;
    }
    let isUpdate = User.allUsers[index].update(property,value);
    if(!isUpdate){
        resp.status(404).send("User not Updated")
        return;
    }
    console.log(User.allUsers[index]);
    resp.status(200).send("Updated");
    return;
}

function deleteuser(req,resp){
    const isValidUser =  JWTPayload.isValidUser(req,resp)
    if(!isValidUser){
        return "No Access"
    }
    const schema = Joi.object({
        userName: Joi.string().min(3).trim().required()
    })
    const {error,value} = schema.validate(req.body)
    if(error){
        resp.status(400).send(error.details[0].message);
        return;
    }

    const userName = req.body.userName;
    console.log(userName);
    let [message,isactive,index] = User.findUser(userName)
    console.log(index);
    if(!message){
        resp.status(404).send("User doesn't Exist");
       return;
    }
    if(User.allUsers[index].isActive == true){
    User.allUsers[index].isActive = false
    }
    else{
    User.allUsers[index].isActive = true
    }

    resp.status(200).send("Deleted Successfully")
    return
}

module.exports = {createuser,getuser,updateuser,deleteuser}