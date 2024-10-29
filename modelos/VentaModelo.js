const { ventas } = require("../bd/conexion");
class Venta {
    constructor(data) {
        this.id=data.id;
        this.fechayhora = data.fechayhora;
        this.id_usuario = data.id_usuario;
        this.id_producto = data.id_producto;
        this.cantidad = data.cantidad;
        this.estado = data.estado;
    }

    
    set id(id) {
        this._id = id;
    }
    set fechayhora(fechayhora) {
            this._fechayhora = fechayhora;
    }

    set id_producto(id_producto) {
        this._id_producto = id_producto;
    }

    set cantidad(cantidad) {
        var regexNumeros = /^[0-9]+$/;
        if (regexNumeros.test(cantidad)) {
        this._cantidad = cantidad;
        }
    }

    set id_usuario(id_usuario){
        this._id_usuario=id_usuario;
    }

    set estado(estado){
        this._estado=estado;
    }

    get id() {
        return this._id;
    }
    get fechayhora() {
        return this._fechayhora;
    }
    get cantidad() {
        return this._cantidad;
    }
    get id_producto() {
        return this._id_producto;
    }
    get id_usuario(){
        return this._id_usuario;
    }

    get estado(){
        return this._estado;
    }

    get getVenta() {
        const condid = {
            id : this.id,
            fechayhora : this.fechayhora,
            id_usuario : this.id_usuario,
            id_producto : this.id_producto,
            cantidad : this.cantidad,
            estado : this.estado
        }
        const sinid = {
            fechayhora : this.fechayhora,
            id_usuario : this.id_usuario,
            id_producto : this.id_producto,
            cantidad : this.cantidad,
            estado : this.estado
        }
        if (this.id == undefined) {
            return sinid;
        } else {
            return condid;
        }
    }
}

module.exports = Venta;