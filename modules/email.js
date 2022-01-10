const sgMail = require('@sendgrid/mail')
const names  = require('./email_config.js')

sgMail.setApiKey(names.key)

const msg = {
  to: null, // Change to your recipient
  from: names.sender, // Change to your verified sender
  subject: 'Test',
  text: 'testing',
  html: '<button>this is a button</button>',
}

function send(receiver = names.receiver){
    msg.to = receiver
    sgMail.send(msg)
    .then((a) => {
        console.log("email sent:", a[0].statusCode == 202)
    })
    .catch((error) => {
        console.error(error)
    })
  }

  module.exports = {
      send: send
  }