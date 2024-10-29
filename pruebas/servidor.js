const express = require("express");
require("dotenv").config();
const app = express();
//middleware
var saludo=(req,res,next)=>{
    console.log("hola");
    next();
}

app.use(saludo);

app.get("/",saludo,(req,res)=>{
    res.send("Hola estas en la raiz");
});

app.get("/home",saludo,(req,res)=>{
    res.send("Hola estas en home");
});

app.get("/otro",(req,res)=>{
    res.send("Hola estas en otro");
});

const port=process.env.PORT||3000;
app.listen(port,()=>{
    console.log("Servidor en http://localhost:"+port);
});