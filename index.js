const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const User = require('./model/user.js')
app.use(cookieParser())
app.use(cors())
app.use(bodyParser.json())
const {login} = require('./controller/login/controller');
const {createuser,getuser,updateuser, deleteuser} = require('./controller/user/controller')
const {createContact,getallcontacts,deleteUserContact} = require('./controller/contact/controller')
const {createContactDetail} = require("./controller/contactdetail/controller")
const {logout} = require('./controller/logout/controller')

let admin = null
let message = null

async function  creteadmin(){
      [admin,message] = await User.createAdmin()
}
 
app.post("/api/login",async (req,resp)=>login(req,resp))

app.post("/api/createuser",async (req,resp)=>createuser(req,resp,admin))

app.get("/api/getuser",(req,resp)=>getuser(req,resp))

app.put("/api/updateuser",(req,resp)=>updateuser(req,resp))

app.post("/api/createContact",(req,resp)=>createContact(req,resp))

app.get("/api/getallcontacts",(req,resp)=>getallcontacts(req,resp))

app.post("/api/createContactDetail",(req,resp)=>createContactDetail(req,resp))

app.post("/api/deleteUserContact",(req,resp)=>deleteUserContact(req,resp))

app.post("/api/logout",(req,resp)=>logout(req,resp))

app.post("/api/deleteuser",(req,resp)=>deleteuser(req,resp))

app.listen(8008,()=>{
    creteadmin()
    console.log("app is started at port 8008");
})
