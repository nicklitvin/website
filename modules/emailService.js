const names  = require('./email_config.js')
const email = require("./emailSend.js")

class EmailService{
    constructor(url){
        this.url = url
    }

    makeHtml(encoded){
        const html = 
            `
            <h2>Did you create a new account?</h2>
            <a href="${this.url}/confirm/?e=${encoded}">
                <button>Confirm</button>    
            </a>
            `
        console.log(html)
        return(html)
    }

    send(receiver = names.receiver, encoded) {
        email.send({
            Host: "smtp.gmail.com",
            Username: names.sender,
            Password: names.senderPassword,
            To: receiver,
            From: names.sender,
            Subject: "Confirmation",
            Body: this.makeHtml(encoded),
            IsBodyHtml: true
        })
        .then(message => console.log(`mail sent successfully to ${receiver}`))
    }
}

module.exports = {
    EmailService: EmailService
}
