const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app)
const io = require('socket.io')(server)

var logMensagens = [];
var usuarios = [];

app.use(express.static(path.join(__dirname, 'public')))
app.set("views", path.join(__dirname, 'public'))
app.engine("html", require("ejs").renderFile)
app.set("view engine", "html")

app.use("/", function(req, res){
    res.render("index.html")
})

io.on("connection", function(socket){
    console.log("Socket conectado com a id: "+socket.id)

    socket.emit("mensagensAnteriores", logMensagens)

    socket.on('envio', function(data){
        logMensagens.push(data);
        usuarios.push(data.username);
        socket.broadcast.emit("recebe", logMensagens);
        socket.broadcast.emit("lista", usuarios);
    });
    
})

server.listen(3000, function(){
    console.log("Servidor executando")
})
