const Account = require("./Account.js")
const CryptoJS = require("crypto-js")
const email = require("./emailService.js")

const EMAIL_ENABLED = false
const ACCEPTED_EMAIL_DOMAINS = [
    "@gmail.com", "@yahoo.com", "@outlook.com"
]

class AccountManager{
    constructor(key,url){
        this.key = key
        this.url = url
        this.accounts = []
        this.email = new email.EmailService(url)
    }

    // VERIFICATION

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
        if(!this.isEmailTaken(email) && this.isEmailLegit(email)){
            const acc = new Account.Account(email,txt.password)
            acc.setSid()
            this.accounts.push(acc)
            this.sendUserSidAndRedirect(res,acc.sid)
        }
        else{
            this.redirectUserToHome(res)
        }
    }

    isEmailLegit(email){
        for(let domain of ACCEPTED_EMAIL_DOMAINS){
            if(email.includes(domain)){
                return true
            }
        }
    }

    // MAIN PAGE REQUESTS

    processAccountRequest(req,res){
        const txt = req.body
        console.log(txt)
        try{
            const keys = Object.keys(txt)
            if(keys.includes("password") || keys.includes("sid")){
                this.tryLoginUser(txt,res)
            }
            else{
                this.sendVerificationCode(txt,res)
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
        if(!this.isEmailLegit(txt.email)){
            return this.sendBadInputError(res)
        }
        const encoded = CryptoJS.AES.encrypt(txt.email, this.key).toString()
        if(EMAIL_ENABLED){
            this.email.send(txt.email,encoded)
        }
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

    // LOGIN

    tryLoginUser(txt,res){
        const sid = this.isLegitLogin(txt)
        if(sid){
            this.sendSidAndLogin(res,sid)
        }
        else{
            this.sendBadInputError(res)
        }
    }

    isLegitLogin(txt){
        if(txt.sid){
            for(let acc of this.accounts){
                if(acc.sid == txt.sid){
                    return acc.sid
                }
            }
        }   
        else{
            for(let acc of this.accounts){
                if(acc.email == txt.email && acc.password == txt.password){
                    return acc.sid
                }
            }
        }
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

    sendUserSidAndRedirect(res,sid=null){
        const data = {
            sid: sid,
            message: "Account created",
            url: this.url
        }
        res.send(JSON.stringify(data)) 
    }

    sendSidAndLogin(res,sid=null){
        const data = {
            sid: sid,
            message: "Succesfully logged in"
        }
        res.send(JSON.stringify(data)) 
    }

    redirectUserToHome(res){
        const data = {url: this.url}
        res.send(JSON.stringify(data)) 
    }
}

module.exports = {
    AccountManager: AccountManager
}