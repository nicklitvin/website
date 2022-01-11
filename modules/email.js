const names  = require('./email_config.js')
const email = require("./emailService.js")

function send(receiver = names.receiver) {
	email.send({
        Host: "smtp.gmail.com",
        Username : names.sender,
        Password : names.senderPassword,
        To : names.receiver,
        From : names.sender,
        Subject : "Confirmation",
        Body : "<email body>",
	})
    .then(message => console.log("mail sent successfully"))
}

module.exports = {
    send: send
}