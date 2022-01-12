const names  = require('./email_config.js')
const email = require("./emailService.js")
let website_url

function setUrl(url){
    website_url = url
}

function makeHtml(sid=1){
    const html = 
        `
        <h2>Did you create a new account?</h2>
        <a href="${website_url}/confirm/?sid=${sid}">
            <button>Confirm</button>    
        </a>
        `
    console.log(html)
    return(html)
}

function send(receiver = names.receiver) {
	email.send({
        Host: "smtp.gmail.com",
        Username: names.sender,
        Password: names.senderPassword,
        To: receiver,
        From: names.sender,
        Subject: "Confirmation",
        Body: makeHtml(),
        IsBodyHtml: true
	})
    .then(message => console.log(`mail sent successfully to ${receiver}`))
}

module.exports = {
    sendVerification: send,
    setUrl: setUrl
}
