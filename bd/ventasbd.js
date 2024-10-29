const ventasbd = require("./conexion").ventas;
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
    const ventas = await ventasbd.get();
    var ventasvalidas = [];
    ventas.forEach(async (venta) => {
        const venta1 = new Venta({ id: venta.id, ...venta.data() });
        //console.log(await validarDatos(venta1.getVenta));
        if (await validarDatos(venta1.getVenta)) {
            //console.log("entra ");
            //console.log(venta1.getVenta);
            ventasvalidas.push(venta1.getVenta);
            //console.log(ventasvalidas);

        }
    });
    //console.log(ventasvalidas);

    return ventasvalidas;
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
            estado:"cancelado"
        });
        ventaCancelada = true;
    }
    return ventaCancelada;
}

async function modificarVenta(data) {
    var ventaValida = await buscarPorID(data.id);
    var ventaModificada = false;
    if (ventaValida) {
        await ventasbd.doc(data.id).update({
            cantidad: data.cantidad
        });
        ventaModificada = true;
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