import express from 'express'
const app = express()

app.use(express.static("static"))
app.use(express.json())

const PORT = 5000
app.listen(PORT)

var info = []

app.post("/", (req,res)=>{  
    const txt = req.body
    try{
        const sid = txt.isNew == "on" ? createAccount(txt) : isLegitLogin(txt)
        if(!sid){throw Error}
        res.send(JSON.stringify({"sid":sid}))
        return
    }
    catch{
        try{
            if(txt.sid){
                removeBadSid(res) 
            }
        }
        catch{
            sendError(res)
        }
    }
})

function makeId(digits=6){
    var id = 0
    for(let digit=0; digit<digits; digit++){
        id += 10**digit * Math.ceil(Math.random()*9)
    }
    return id
}

function createAccount(txt,testSID=null){
    var sid = testSID || makeId()
    info.push({
        email: txt.email,
        password: txt.password,
        sid: sid
    })
    return sid
}

function isLegitLogin(txt){
    if(txt.sid){
        for(let acc of info){
            if(acc.sid == txt.sid){
                return acc.sid
            }
        }
    }   
    else{
        for(let acc of info){
            if(acc.email == txt.email && acc.password == txt.password){
                return acc.sid
            }
        }
    }
}

function sendError(res){
    const error = {error: "invalid login"}
    res.send(JSON.stringify(error))
}

function removeBadSid(res){
    const error = {badSid: 1}
    res.send(JSON.stringify(error))
}


// TESTS
const testId = 5
const txt = {
    email: 1,
    password: 2
}
const bad = {
    email: 1,
    password: 3
}
const sidLogin = {
    sid: testId
}

console.assert(createAccount(txt, testId) == testId, "create account")
console.assert(info.length == 1, "info add")
console.assert(info[0].email == txt.email, "email")
console.assert(info[0].password == txt.password, "password")
console.assert(info[0].sid == testId, "sid")
console.assert(isLegitLogin(bad) == null, "bad login" )
console.assert(isLegitLogin(txt) == testId, "good login")
console.assert(isLegitLogin(sidLogin) == testId, "good sid login")

info = []
