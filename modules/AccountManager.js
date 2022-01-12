const Account = require("./Account.js")
const CryptoJS = require("crypto-js")
const email = require("./emailService.js")

class AccountManager{
    constructor(key,url){
        this.key = key
        this.url = url
        this.accounts = []
        this.email = new email.EmailService(url)
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
        if(!this.isEmailTaken(email)){
            const acc = new Account.Account(email,txt.password)
            acc.setSid()
            this.accounts.push(acc)
            this.sendUserSid(res,acc.sid)
        }
    }

    processAccountRequest(req,res){
        const txt = req.body
        console.log(txt)
        try{
            if(txt.action == "create"){
                this.sendVerificationCode(txt,res)
            }
            else{
                this.tryLoginUser(txt,res)
            }
        }
        catch{
            this.sendBadInputError(res)
        }
    }
    
    sendVerificationCode(txt,res){
        if(this.isEmailTaken(txt.email)){
            return this.sendEmailTakenError(res)
        }
        const encoded = CryptoJS.AES.encrypt(txt.email, this.key).toString()
        this.email.send(txt.email,encoded)
        console.log(`${this.url}/confirm/?e=${encoded}`)
        this.sendVerificationMessage(res)
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

    sendUserSid(res,sid=null){
        const data = {sid: sid}
        res.send(JSON.stringify(data)) 
    }
}

module.exports = {
    AccountManager: AccountManager
}