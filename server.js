import express from 'express'
const app = express()

app.use(express.static("static"))
app.use(express.json())

const PORT = 5000
app.listen(PORT)

var info = []

app.post("/", (req,res)=>{  
    const txt = req.body
    a: try{
        if(txt.isNew == "on"){
            var SID = createAccount(txt)
            res.send(JSON.stringify({"SID":SID}))
            return
        }
        else{
            var SID = isLegitLogin(txt)
            if(!SID){throw Error}
            res.send(JSON.stringify({"SID":SID}))
            return
        }
    }
    catch{
        sendError(res)
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
    var SID = testSID || makeId()
    info.push({
        email: txt.email,
        password: txt.password,
        sid: SID
    })
    console.log(info) 
    return SID
}

function isLegitLogin(txt){
    for(let acc of info){
        if(acc.email == txt.email && acc.password == txt.password){
            return acc.sid
        }
    }
}

function sendError(res){
    const error = {error: "invalid login"}
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

console.assert(createAccount(txt, testId) == testId, "create account")
console.assert(info.length == 1, "info add")
console.assert(info[0].email == txt.email, "email")
console.assert(info[0].password == txt.password, "password")
console.assert(isLegitLogin(bad) == null, "bad login" )
console.assert(isLegitLogin(txt) == testId, "good login")

info = []
