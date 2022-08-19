const uuid = require('uuid')
const ContactDetail = require('./contactdetails')

class Contact{
    constructor(firstName,lastName) {
        this.contactID = uuid.v4()
        this.firstName = firstName
        this.lastName = lastName
        this.fullName = firstName+" "+lastName
        this.isActive = true
        this.contactDetails = []
}
    findContactDetail(type){
        for (let index = 0; index < this.contactDetails.length; index++) {
            const eachDetail = this.contactDetails[index];
            if(type == eachDetail.type){
                return [true,index]
            }
            
        }
        return [false,-1]
    }

    createContactDetail(type,value){
        if(this.isActive == false){
            return false
        }

        // this.contactDetails.forEach(eachDetail => {
        //     if(type == eachDetail.type){
        //         return [false,"Type exists!!!"]
        //     }
        // });
        for (let index = 0; index < this.contactDetails.length; index++) {
            if(this.contactDetails[index].type == type){
                return [false,"Type exists!!!"]
            }
            
        }
        let newContactDetail = new ContactDetail(type,value)
        this.contactDetails.push(newContactDetail)
        return [true,newContactDetail]
    }

    checkActive(fullName){
        if(this.isActive == false){
            return false
        }
        if(this.fullName == fullName){
            return true
        }
    }

    deleteContact(){
        if(this.isActive == false){
            return false
        }
        this.isActive = false
        return true
    }
  
}
module.exports = Contact