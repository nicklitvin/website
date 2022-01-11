### Description

Server and website containing common features such as account creation for future customization

### Setup

```
npm install
```

create /modules/email_config.js with the following:

```
const sender = <"sender's gmail">
const senderPassword = <"sender's gmail password"> 
const receiver = <"receiver's gmail for testing">

module.exports = {
    receiver: receiver,
    sender: sender,
    senderPassword: senderPassword
}
```

In sender's Gmail account, turn on setting "Less secure app access"

