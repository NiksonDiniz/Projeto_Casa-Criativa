// rodar o server.js use comando "node server.js"
// começar projeto "npm init -y"
// instalar o express "npm i express"
// instalar o nodemon (monitora o node)"npm i nodemon"
// instalar nunjucks 'npm i nunjucks'(usar variaveis no html)
// instalar sqlite3 'npm i sqlite3'

//criando servidor usando o express

const express = require("express")
const server = express()

const db = require("./db")

//configurar arquivos estáticos(css, scripts, imagens)
server.use(express.static("public"))

//habilitar uso do req.body
server.use(express.urlencoded({extended: true}))

//configuração do nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("views", {
    express: server,
    noCache: true,//boolean
})


//criei uma rota
server.get("/",function(req, res){

    db.all(`SELECT * FROM ideas`, function(err, rows){
        if (err){
            console.log(err)
            return res.send("Erro no banco de dados!")
        }
        
        const reverseIdeas = [...rows].reverse()
    
        let lastIdeas = []
        for(let idea of reverseIdeas){
            if(lastIdeas.length < 3){
                lastIdeas.push(idea)
            }
        }
    
        return res.render("index.html", {ideas: lastIdeas})
    })
})

server.get("/ideias",function(req, res){
    db.all(`SELECT * FROM ideas`, function(err, rows){
        if (err){
            console.log(err)
            return res.send("Erro no banco de dados!")
        }

        const reverseIdeas = [...rows].reverse()    
        return res.render("ideias.html", {ideas: reverseIdeas})
    })
})

server.post("/", function(req, res){
    //inserir dados na tabela
    const query = `
        INSERT INTO ideas(
        image,
        title,
        category,
        description,
        link  
        ) VALUES(?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link
    ]

    db.run(query, values, function(err){
        if (err){
            console.log(err)
            return res.send("Erro no banco de dados!")
        }
        return res.redirect("/ideias")
    })
})

// servidor ligado na porta 3000
server.listen(3000)
