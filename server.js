//usei o express pra criar e configurar um servidor
const express = require("express")
const server = express()

const db = require("./db")

//configura arquivos estaticos (css, scripts, imagens)
server.use(express.static("public"))

// habilitar uso do req.body
server.use(express.urlencoded({ extended: true }))

//configuracao no nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("views", {
    express: server,
    noCache: true, // boolean
})

// criei uma rota /
// e capturo o pedido do cliente para responder
server.get("/", function (req, res) {

    db.all(` SELECT * FROM ideas`, function (err, rows) {
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados!")
        }

        const reversedIdeas = [...rows].reverse()

        let lastIdeas = []
        for (let idea of reversedIdeas.reverse()) {
            if (lastIdeas.length < 2) {
                lastIdeas.push(idea)
            }
        }

        return res.render("index.html", { ideas: lastIdeas })
    })

})

server.get("/ideias", function (req, res) {
    db.all(` SELECT * FROM ideas`, function (err, rows) {
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados!")
        }
        //  depois fazer console.log(rows)
        const reversedIdeas = [...rows].reverse()
        
        return res.render("ideias.html", { ideas: reversedIdeas })
    })

})

server.post("/", function (req, res) {
    //Inserir dado na tabela 

    const query = `
        INSERT INTO ideas (
            image,
            title,
            category,
            description,
            link
        ) VALUES (?,?,?,?,?);
        `

    const values = [

        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link,
    ]

    db.run(query, values, function (err) {
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados!")
        }

        return res.redirect("/ideias")

    })
})
// deletar ideia
server.post("/ideias", function (req, res) {
    
    db.run (`DELETE FROM ideas WHERE id = ?`, [req.body.id], function(err){
        if  (err) return console.log(err)
        console.log("DELETEI", this)
    })
    return res.redirect("/ideias")
})

//liguei meu servidor na porta 3000
server.listen(3000)
