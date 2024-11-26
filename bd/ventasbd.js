const ventasbd = require("./conexion").ventas;

const productosBD = require("./conexion").productos;
const usuariosBD = require("./conexion").usuarios;
const Venta = require("../modelos/VentaModelo");
var { validarID, validarCantidad } = require("../bd/productosbd");
var buscarUsuarios = require("../bd/usuariosbd").validarID;

async function validarDatos(venta) {
    var valido = false;
    if (venta.fechayhora != undefined && venta.id_usuario != undefined && venta.id_producto != undefined && venta.cantidad != undefined && venta.estado != undefined) {
        valido = true;
    }
    //console.log(valido);
    return valido;
}



async function mostrarVentas() {
    const ventasQuery = await ventasbd.where("estado", "==", "vendido").get();
    const ventasValidas = [];

    for (const ventaDoc of ventasQuery.docs) {
        const ventaData = ventaDoc.data();

        const productoDoc = await productosBD.doc(ventaData.id_producto).get();
        const productoData = productoDoc.exists ? productoDoc.data() : null;

        const usuarioDoc = await usuariosBD.doc(ventaData.id_usuario).get();
        const usuarioData = usuarioDoc.exists ? usuarioDoc.data() : null;

        if (productoData && usuarioData) {
            const ventaConDetalles = {
                id: ventaDoc.id,
                cantidad: ventaData.cantidad,
                estado: ventaData.estado,
                fechayhora: ventaData.fechayhora,
                producto: productoData.producto,
                usuario: usuarioData.usuario,
            };

            ventasValidas.push(ventaConDetalles);
        }
    }

    return ventasValidas;
}




async function buscarPorID(id) {
    const venta = await ventasbd.doc(id).get();
    //console.log(venta);
    const venta1 = new Venta({ id: venta.id, ...venta.data() });
    var ventaValida = false;
    // console.log(venta1);
    if (validarDatosNuevos(venta1.getVenta)) {
        ventaValida = venta1.getVenta;
    }
    //console.log(ventaValida);

    return ventaValida;
}

async function validarDatosNuevos(venta) {
    var valido = false;
    if (venta.fechayhora != undefined && venta.id_usuario != undefined && venta.id_producto != undefined && venta.cantidad != undefined && venta.estado != undefined) {
        //console.log(await buscarUsuarios(venta.id_usuario));
        if (await buscarUsuarios(venta.id_usuario)) {
            if (await validarID(venta.id_producto)) {
                if (await validarCantidad(venta.id_producto, venta.cantidad)) {
                    valido = true;
                }
            }
        }
    }
    //console.log(valido);
    return valido;
}

async function nuevaVenta(data) {
    data.fechayhora = new Date().toLocaleString();
    data.estado = "vendido";
    const venta1 = new Venta(data);
    var ventaValida = false;
    if (await validarDatosNuevos(venta1.getVenta)) {
        await ventasbd.doc().set(venta1.getVenta);
        ventaValida = true;
    }
    return ventaValida;
}

async function modEstadoVenta(id) {
    var ventavalida = await buscarPorID(id);
    var ventaCancelada = false;
    if (ventavalida) {
        await ventasbd.doc(id).update({
            estado: "cancelado"
        });
        ventaCancelada = true;
    }
    return ventaCancelada;
}

async function modificarVenta(data) {
    var ventaValida = await buscarPorID(data.id);
    var ventaModificada = false;

    if (ventaValida) {
        const actualizaciones = {};


        if (data.cantidad !== undefined) {
            actualizaciones.cantidad = data.cantidad;
        }
        if (data.id_usuario !== undefined) {
            actualizaciones.id_usuario = data.id_usuario;
        }
        if (data.id_producto !== undefined) {
            actualizaciones.id_producto = data.id_producto;
        }

        if (Object.keys(actualizaciones).length > 0) {
            await ventasbd.doc(data.id).update(actualizaciones);
            ventaModificada = true;
        }
    }

    return ventaModificada;
}


module.exports = {
    buscarPorID,
    mostrarVentas,
    nuevaVenta,
    modEstadoVenta,
    modificarVenta
}