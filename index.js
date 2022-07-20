const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const uuid = require('uuid')
const cookieParser = require('cookie-parser')

const User = require('./model/user.js')
const JWTPayload = require('./model/authentication.js')
const Contact = require('./model/contact');


app.use(cookieParser())
app.use(cors())
app.use(bodyParser.json())

const [admin,message] = User.createAdmin()
app.post("/api/login",(req,resp)=>{
    const {userName,password}= req.body
    let [userExists,isactive,index] = User.findUser(userName)
    if(!userExists || User.allUsers[index].credential.password!= password)
    {
        resp.status(404).send("Wrong Credentials")
        return;
    }
    const newPayload = new JWTPayload(User.allUsers[index])
    const newToken = newPayload.createToken();
    resp.cookie("myToken",newToken)
    resp.status(200).send("Logged in  Successfully");
})
app.post("/api/createuser",async (req,resp)=>{
    const isValidAdmin =  JWTPayload.isValidAdmin(req,resp)
    if(!isValidAdmin){
        return;
    }
    let {firstName,lastName,userName ,password,role} = req.body;
    let [newUser,message] = await admin.createUser(firstName,lastName,userName,password,role);
    if(newUser == false )
    {
        resp.status(404).send(message);

    }
    resp.status(200).send(newUser);
})
app.get("/api/getuser",(req,resp)=>{
    const isValidAdmin =  JWTPayload.isValidAdmin(req,resp)
    if(!isValidAdmin){
        return;
    }
    resp.status(201).send(User.allUsers)
})

app.put("/api/updateuser",(req,resp)=>{
    const isValidAdmin =  JWTPayload.isValidAdmin(req,resp)
    if(!isValidAdmin){
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
    resp.status(200).send(User.allUsers);
    return;
})

app.post("/api/createContact",(req,resp)=>{
    const isValidUser =  JWTPayload.isValidUser(req,resp)
    if(!isValidUser){
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
    resp.status(200).send(newcontact);
    return text;
})

app.get("/api/getallcontacts",(req,resp)=>{
    const isValidUser =  JWTPayload.isValidUser(req,resp)
    if(!isValidUser){
        return "No Access "
    }
    const userName = req.body.userName;
    let [message,isactive,index] = User.findUser(userName)
    if(!message){
        resp.status(404).send("User doesn't Exist");
       return;
    }

    resp.status(200).send(User.allUsers[index].contacts)
})

app.post("/api/createContactDetail",(req,resp)=>{
    const isValidUser =  JWTPayload.isValidUser(req,resp)
    if(!isValidUser){
        return "unauthorized access"
    }

    const userName = req.body.userName
    const fullName = req.body.fullName
    const type = req.body.type
    const value = req.body.value
  
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
    resp.status(200).send(message);
})

app.post("/api/deleteUserContact",(req,resp)=>{
    const isValidUser =  JWTPayload.isValidUser(req,resp)
    if(!isValidUser){
        return "No Access"
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
})


app.post("/api/logout",(req,resp)=>{
    resp.cookie("myToken",'none',{
        expires: new Date(Date.now()+ 0*1000),
    })
    resp.status(200).send(" Logged out Successfully");
})

app.listen(8008,()=>{
    console.log("app is started at port 8008");
})
