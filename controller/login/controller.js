const JWTPayload = require("../../model/authentication");
const User = require('../../model/user');
const Joi = require('joi');

async function login(req,resp){

    const schema = Joi.object({
        userName : Joi.string().min(3).required(),
        password : Joi.string().min(3).required()
    })
    const {error,val} = schema.validate(req.body)
    if(error){
        resp.status(400).send(error.details[0].message);
        return;
    }
        const {userName,password}= req.body
        let [userExists,isactive,index] = User.findUser(userName)
        if(!userExists){
            resp.status(404).send("User Doesn't Exist")
            return;
        }
        let passwordsuccess = await User.allUsers[index].comparePassword(password);
        console.log(passwordsuccess);
        if(passwordsuccess == false)
        {
            resp.status(401).send("Wrong Credentials")
            return;
        }
    
        const newPayload = new JWTPayload(User.allUsers[index])
        const newToken = newPayload.createToken();
        resp.cookie("myToken",newToken)
        resp.status(201).send(User.allUsers[index].role);
}

module.exports = {login};