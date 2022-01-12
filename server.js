const express = require("express")
const email = require("./modules/email.js")
const AccountManager = require("./modules/AccountManager.js")

const app = express()

app.use(express.static("static"))
app.use(express.json())

const PORT = 5000
app.listen(PORT)

const key = "asdb12t132"
const url = `http://localhost:${PORT}`
const manager = new AccountManager.AccountManager(key,url)

app.post("/", (req,res)=>{
    manager.processAccountRequest(req,res)
})

app.post("/confirm", (req,res)=>{
    manager.processVerificationRequest(req,res)
})






// var info = []
// var verifyList = []
// const url = `http://localhost:${PORT}`
// const EMAIL_VERIFICATION_ENABLED = 1
// email.setUrl(url)
// email.sendVerification()

// app.post("/", (req,res)=>{
//     processLoginRequest(req,res)
// })

// app.post("/confirm", (req,res)=>{
//     processVerificationRequest(req,res)
// })

// function processLoginRequest(req,res){
//     const txt = req.body
//     console.log(txt)
//     try{
//         if(txt.confirmSid){
//             console.log("confirming")
//         }
//         else if(txt.isNew == "on"){
//             tryCreateAccount(txt,res)
//         }
//         else{
//             tryLoginUser(txt,res)
//         }
//     }
//     catch{
//         sendBadInputError(res)
//     }
// }

// function processVerificationRequest(req,res,testTxt=null){
//     console.log(info,verifyList)
//     const txt = testTxt || req.body
//     try{
//         if(!txt.id){
//             throw Error
//         }
//         const accountArray = verifyList.filter(acc => acc.sid == txt.id)
//         if(account != 1){
//             throw Error
//         }
//         const account = accountArray[0]
//         info.push(account)
//         verifyList = verifyList.filter(acc => acc.email != account.email)
//         console.log(info,verifyList)
//     }
//     catch{
//         console.log("error with confirm")
//     }
// }

// // CREATE ACCOUNT

// function tryCreateAccount(txt,res){
//     if(isEmailTaken(txt.email)){
//         return sendEmailTakenError(res)
//     }
//     if(isPasswordBad(txt.password)){
//         return sendBadPasswordError(res)
//     }
//     const sid = makeId()
//     if(EMAIL_VERIFICATION_ENABLED){
//         console.log("begin email verification")
//         // email.sendVerification(txt.email,sid)
//         verifyList.push({
//             sid: 1,
//             password: txt.password,
//             email: txt.email
//         })
//         // res.send(JSON.stringify({error: `${url}/confirm/?id=1`}))
//         // res.send(JSON.stringify({error: "confirmation sent to email"}))
//     }
//     else{
//         const sid = createAccount(txt)
//         res.send(JSON.stringify({"sid":sid}))
//     }
// }

// function isEmailTaken(email){
//     for(var acc of info){
//         if(acc.email == email){
//             return true
//         }
//     }
//     return false
// }

// function isPasswordBad(password){
//     return false
// }

// // check 
// function createAccount(txt,testSID=null){
//     var sid = testSID || makeId()
//     info.push({
//         email: txt.email,
//         password: txt.password,
//         sid: sid
//     })
//     return sid
// }

// function makeId(digits=6){
//     var id = 0
//     for(let digit=0; digit<digits; digit++){
//         id += 10**digit * Math.ceil(Math.random()*9)
//     }
//     return id
// }

// // LOGIN USER

// function tryLoginUser(txt,res){
//     const sid = isLegitLogin(txt)
//     if(!sid && txt.sid){
//         return sendBadSidError(res)
//     }
//     else if(!sid){
//         return sendBadLoginError(res)
//     }
//     res.send(JSON.stringify({"sid":sid}))
// }

// function isLegitLogin(txt){
//     if(txt.sid){
//         for(let acc of info){
//             if(acc.sid == txt.sid){
//                 return acc.sid
//             }
//         }
//     }   
//     else{
//         for(let acc of info){
//             if(acc.email == txt.email && acc.password == txt.password){
//                 return acc.sid
//             }
//         }
//     }
// }

// SEND ERROR



// function sendBadLoginError(res){
//     const error = {error: "invalid login"}
//     res.send(JSON.stringify(error))
// }

// function sendBadSidError(res){
//     const error = {badSid: "bad sid is removed"}
//     res.send(JSON.stringify(error))
// }



// function sendBadPasswordError(res){
//     const error = {error: "bad password"}
//     res.send(JSON.stringify(error))
// }

// // TESTS
// const testId = 5
// const txt = {
//     email: 1,
//     password: 2
// }
// const bad = {
//     email: 1,
//     password: 3
// }
// const sidLogin = {
//     sid: testId
// }

// console.assert(createAccount(txt, testId) == testId, "create account")
// console.assert(info.length == 1, "info add")
// console.assert(info[0].email == txt.email, "email")
// console.assert(info[0].password == txt.password, "password")
// console.assert(info[0].sid == testId, "sid")
// console.assert(isLegitLogin(bad) == null, "bad login" )
// console.assert(isLegitLogin(txt) == testId, "good login")
// console.assert(isLegitLogin(sidLogin) == testId, "good sid login")

// info = []
