const uuid = require('uuid');
const bcrypt = require('bcrypt');
class Credentials
{
    static allCredentials = [];
    constructor(userName, password)
    {
        this.userName = userName;
        this.password = password;
        this.CredentialId = uuid.v4();
    }

    async getHashPassword(){
        return bcrypt.hash(this.password,10);
    }

    static findusername(userName){
        for (let index = 0; index < Credentials.allCredentials.length; index++) {
            if(Credentials.allCredentials[index].userName == userName){
                return [true,index]
            }
        }
        return [false,-1]
    }

    static createCredential(userName,password){
       let [isUserNameExist] = Credentials.findusername(userName)
        if(isUserNameExist){
            return [false,"UserName Already Exist"]
        }
        let newcredentials = new Credentials(userName,password)
        Credentials.allCredentials.push(newcredentials)
        return newcredentials
    }
}
module.exports = Credentials;