const express = require("express")
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
