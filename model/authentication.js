const jwt = require("jsonwebtoken")
class JWTPayload{
    static secretkey = "strongPassword";
    constructor(user){
        this.userName = user.credential.userName;
        this.role = user.role;
        this.firstName = user.firstName;
        this.isActive = user.isActive;
    }
    
    createToken()
    {
        return jwt.sign(JSON.stringify(this),JWTPayload.secretkey)
    }

    static verifyCookie(token)
    {
        return jwt.verify(token,JWTPayload.secretkey)
    }

    static isValidUser(req,resp)
    {
        const myToken = req.cookies["myToken"];
        if(!myToken)
        {
            resp.status(404).send("Login required");
            return false
        }

        const newPayload = JWTPayload.verifyCookie(myToken);
        if(!newPayload.isActive)
        {
            resp.status(404).send("Admin Login Required");
            return false
        }
        return true
    }

    static isValidAdmin(req,resp)
    {
        const myToken = req.cookies["myToken"];
        if(!myToken)
        {
            resp.status(404).send("Login required");
            return false
        }

        const newPayload = JWTPayload.verifyCookie(myToken);
        if(newPayload.role != "admin")
        {
            resp.status(404).send("Admin Login Required");
            return false
        }
        return true
    }
}

module.exports = JWTPayload;