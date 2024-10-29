var rutas = require("express").Router();
const { ventas } = require("../bd/conexion");
var {mostrarVentas,buscarPorID,modEstadoVenta,nuevaVenta,modificarVenta}=require("../bd/ventasbd");

rutas.get("/",async(req,res)=>{//ya esta
    var ventasvalidas=await mostrarVentas();
    res.json(ventasvalidas);
});


rutas.get("/buscarPorId/:id",async(req,res)=>{//ya esta
    var ventaValida=await buscarPorID(req.params.id);
    res.json(ventaValida);
});

rutas.patch("/ventaModificada/:id",async(req, res)=>{
    var ventaModificada=await modEstadoVenta(req.params.id);
    res.json(ventaModificada);
});

rutas.post("/nuevaVenta",async(req,res)=>{
    var ventaValida=await nuevaVenta(req.body);
    res.json(ventaValida);
});

rutas.post("/modificarVenta", async(req,res)=>{
    var ventaModificada=await modificarVenta(req.body);
    res.json(ventaModificada);
});

module.exports=rutas;