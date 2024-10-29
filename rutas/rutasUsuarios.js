var rutas = require("express").Router();
const { usuarios } = require("../bd/conexion");
//var {Router}=require("express");
var {mostrarUsuarios,nuevoUsuario,borrarUsuario,buscarPorID,modificarUsuario}=require("../bd/usuariosbd");

rutas.get("/",async(req,res)=>{
    //res.send("Hola estas en raiz");
    var usuariosValidos=await mostrarUsuarios();
    //console.log(usuariosValidos);
    res.json(usuariosValidos);
});


rutas.get("/buscarPorId/:id",async(req,res)=>{
    var usuarioValido=await buscarPorID(req.params.id);
    res.json(usuarioValido);
});

rutas.delete("/borrarUsuario/:id",async(req, res)=>{
    var usuarioBorrado=await borrarUsuario(req.params.id);
    res.json(usuarioBorrado);
});

rutas.post("/nuevoUsuario",async(req,res)=>{
    var usuarioValido=await nuevoUsuario(req.body);
    res.json(usuarioValido);
});

rutas.post("/modificarUsuario", async(req,res)=>{
    var usuarioModificado=await modificarUsuario(req.body);
    res.json(usuarioModificado);
});


module.exports=rutas;