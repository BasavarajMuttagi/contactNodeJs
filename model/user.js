const Contact = require('./contact.js')
const ContactDetails = require('./contactdetails.js')
const Credentials = require('./credentials.js')
const uuid = require('uuid')

class User{

    static allUsers = []
    constructor(firstName,lastName,credential,role){
        this.role = role
        this.userID = uuid.v4()
        this.firstName = firstName
        this.lastName = lastName
        this.credential = credential
        this.isActive = true
        this.contacts = []
    }
    
  

    static findUser(userName){
        for (let index = 0; index < User.allUsers.length; index++) {
            if(User.allUsers[index].credential.userName== userName){
                return [true,User.allUsers[index].isActive,index]
            }
        }
        return [false,false,-1]
    }
    findContact(fullName){
        for (let index = 0; index < this.contacts.length; index++) {
            const contact = this.contacts[index];
            if(contact.fullName == fullName){
                return [true,contact.isActive,index]
            }
        }
        return [false,false,-1]
    }

    createContact(firstName,lastName){
        if(this.isActive == false){
            return [false,"User Invalid!!!",-1]
        }

        let [message,isactive,indexOfContact] = this.findContact(firstName+" "+lastName);
        if(message){
            return [false,"Contact Already Exists !!!",-1]
        }

        let newContact = new Contact(firstName,lastName)
        this.contacts.push(newContact)
        return [true,'Contact Created!',newContact]
    }
    
    createContactDetails(fullName,type,value){
        let [message,isactive,indexOfContact] = this.findContact(fullName);
        if(!message){
            return [false,"Contact doesn't  Exist !!!"]
        }
        let newContactDetil = this.contacts[indexOfContact].createContactDetail(type,value)

        return [newContactDetil,"detail Added successfully"]
    }

    deleteContact(fullName){
        let [message,isactive,indexOfContact] = this.findContact(fullName);
        if(!message){
            return [false,"Contact Doesnt exist!"]
        }
        if(!isactive){
            return [false,"Contact Was Deleted!"]
        }
       let result = this.contacts[indexOfContact].deleteContact()
        return [result,"deleted "]
    }

    static createAdmin(){
      
        let credential = Credentials.createCredential('GR123','GR@2000');
        let newUser = new User('George','Russell',credential,'admin')
        User.allUsers.push(newUser)
        return [newUser,"Admin Created"]
    }

   async createUser(firstName,lastName,userName,password,role){
        if(this.role != "admin") {
            return ["Only Admin Can create users!"];
        }
        let [message,isactive,index] = User.findUser(userName)
        if(message){
            return ["User already exists!!!"]
        }
        if(isactive){
            return
        }
        const credential = Credentials.createCredential(userName,password);
        credential.password = await credential.getHashPassword();
        let newUser = new User(firstName,lastName,credential,role)
        User.allUsers.push(newUser)
        return [newUser,"User Created!!!"]
    }

    deleteUser(userName){
        let [message,isactive,index] = User.findUser(userName)
        if(!isactive){
            return [false ,"User does'nt exist [User Was Deleted]"]
        }
        if(!message){
            return [false,"User Not Found!!!"]
        }
        User.allUsers[index].isActive = false
    }

    updateFirstname(firstName) {
        this.firstName = firstName;
    }

    updateLastName(lastName) {
        this.lastName = lastName;
    }

    update(property,value)
    {
        switch (property) 
        {
            case "firstName": 
                this.updateFirstname(value)
                return true;

            case "lastName": 
                this.updateLastName(value)
                return true;
            
            default: return false;
        }
    }

}


module.exports = User