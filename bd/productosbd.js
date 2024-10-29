const productosBD = require("./conexion").productos;
const Producto = require("../modelos/ProductoModelo");

function validarDatos(producto) {
    var valido = false;
    //console.log(producto);
    if (producto.producto != undefined && producto.cantidad != undefined && producto.precio != undefined) {
        valido = true;
    }
    //console.log(valido);

    return valido;
}

async function mostrarProductos() {
    const productos = await productosBD.get();
    productosValidos = [];
    productos.forEach(producto => {
        const producto1 = new Producto({ id: producto.id, ...producto.data() });
        if (validarDatos(producto1.getProducto)) {
            productosValidos.push(producto1.getProducto);
        }
    });
    return productosValidos;
}

async function buscarPorID(id) {
    const producto = await productosBD.doc(id).get();
    //console.log(producto);
    const producto1 = new Producto({ id: producto.id, ...producto.data() });
    var productoValido = false;
    // console.log(producto1);
    if (validarDatos(producto1.getProducto)) {
        productoValido = producto1.getProducto;
    }
    //console.log(productoValido);

    return productoValido;
}

async function validarID(id) {
    const producto = await productosBD.doc(id).get();
    if (producto.exists) {
        return true;
    } else {
        console.log("Producto no encontrado, id: " + id);
        return false;
    }
}
async function validarCantidad(productoId, cantidad) {
    const producto = await productosBD.doc(productoId).get();
    const productoData = producto.data();
    const stock = productoData.cantidad;
    if (Number(stock) >= Number(cantidad)) {
        await productosBD.doc(productoId).update({
            cantidad: stock - cantidad
        });
        return true;
    } else {
        console.log("Producto insuficiente");
        return false;
    }
}
async function nuevoProducto(data) {
    const producto1 = new Producto(data);
    var productoValido = false;
    if (validarDatos(producto1.getProducto)) {
        await productosBD.doc().set(producto1.getProducto);
        productoValido = true;
    }
    return productoValido;
}

async function borraProducto(id) {
    var productoValido = await buscarPorID(id);
    var productoBorrado = false;
    if (productoValido) {
        await productosBD.doc(id).delete();
        productoBorrado = true;
    }
    return productoBorrado;
}

async function modificarProducto(data) {
    var productoValido = await buscarPorID(data.id);
    var productoModificado = false;
    if (productoValido) {
        await productosBD.doc(data.id).update({
            producto: data.producto,
            cantidad: data.cantidad,
            precio: data.precio
        });
        productoModificado = true;
    }
    return productoModificado;
}


module.exports = {
    buscarPorID,
    mostrarProductos,
    nuevoProducto,
    borraProducto,
    validarID,
    validarCantidad,
    modificarProducto
}