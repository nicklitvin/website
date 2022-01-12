const Account = require("./Account.js")
const CryptoJS = require("crypto-js")

class AccountManager{
    constructor(key,url){
        this.key = key
        this.url = url
        this.accounts = []
    }

    processVerificationRequest(req,res){
        const txt = req.body
        console.log(txt)
        try{
            this.createUserAccount(txt,res)
        }
        catch{
            this.sendBadInputError(res)
        }
    }

    createUserAccount(txt,res){
        const email = CryptoJS.AES.decrypt(txt.email, this.key).toString(CryptoJS.enc.Utf8)
        const acc = new Account.Account(email,txt.password) 
        this.accounts.push(acc)
    }

    processAccountRequest(req,res){
        const txt = req.body
        console.log(txt)
        try{
            if(txt.action == "create"){
                this.tryCreateAccount(txt,res)
            }
            else{
                this.tryLoginUser(txt,res)
            }
        }
        catch{
            this.sendBadInputError(res)
        }
    }
    
    tryCreateAccount(txt,res){
        if(this.isEmailTaken(txt.email)){
            return this.sendEmailTakenError(res)
        }
        const encoded = CryptoJS.AES.encrypt(txt.email, this.key).toString()
        const redirect = `${this.url}/confirm/?e=${encoded}`
        // email.sendVerification(txt.email,encoded)
        this.sendVerificationMessage(res,redirect)
    }
    
    isEmailTaken(email){
        for(var acc of this.accounts){
            if(acc.email == email){
                return true
            }
        }
        return false
    }
    
    // ERROR
    
    sendBadInputError(res){
        const data = {message: "bad input"}
        res.send(JSON.stringify(data))
    }
    
    sendEmailTakenError(res){
        const data = {message: "email already has account"}
        res.send(JSON.stringify(data))
    }
    
    sendVerificationMessage(res,txt=null){
        const data = {message: txt || "verification sent to email"}
        res.send(JSON.stringify(data))
    }
}

module.exports = {
    AccountManager: AccountManager
}