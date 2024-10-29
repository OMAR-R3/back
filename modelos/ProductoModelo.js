const { productos } = require("../bd/conexion");
class Producto {
    constructor(data) {
        this.id = data.id;
        this.producto = data.producto;
        this.precio = data.precio;
        this.cantidad = data.cantidad;
    }

    
    set id(id) {
        this._id = id;
    }
    set producto(producto) {
        var regexNombre = /^[A-ZÁÉÍÓÚÑ'][a-záéíóúñ']{1,}([ ][A-ZÁÉÍÓÚÑ'][a-záéíóúñ']{1,}){0,}$/;
        if (regexNombre.test(producto)) {
            this._producto = producto;
        }

    }

    set precio(precio) {
        var regexNumeros = /^[0-9]+$/;
        if (regexNumeros.test(precio)) {
        this._precio = precio;
        }
    }

    set cantidad(cantidad) {
        var regexNumeros = /^[0-9]+$/;
        if (regexNumeros.test(cantidad)) {
        this._cantidad = cantidad;
        }
    }

    get id() {
        return this._id;
    }
    get producto() {
        return this._producto;
    }
    get cantidad() {
        return this._cantidad;
    }
    get precio() {
        return this._precio;
    }

    get getProducto() {
        const condid = {
            id: this.id,
            producto: this.producto,
            precio: this.precio,
            cantidad: this.cantidad
        }
        const sinid = {
            producto: this.producto,
            precio: this.precio,
            cantidad: this.cantidad
        }
        if (this.id == undefined) {
            return sinid;
        } else {
            return condid;
        }
    }
}

module.exports = Producto;