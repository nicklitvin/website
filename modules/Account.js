const DIGITS = 6

class Account{
    constructor(email=null,password=null,sid=null){
        this.email = email
        this.password = password
        this.sid = sid
    }

    setSid(digits=DIGITS){
        var sid = 0
        for(let digit=0; digit<digits; digit++){
            sid += 10**digit * Math.ceil(Math.random()*9)
        }
        this.sid = sid
        console.log("NEW SID:", this.sid)
    }
}

module.exports = {
    Account: Account
}