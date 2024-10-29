const { usuarios } = require("../bd/conexion");
class Usuario {
    constructor(data) {
        this.id = data.id;
        this.nombre = data.nombre;
        this.usuario = data.usuario;
        this.password = data.password;
        this.salt=data.salt;
        this.tipoUsuario=data.tipoUsuario;
    }
    set id(id) {
        this._id = id;
    }
    set nombre(nombre) {
        var regexNombre = /^[A-ZÁÉÍÓÚÑ'][a-záéíóúñ']{1,}([ ][A-ZÁÉÍÓÚÑ'][a-záéíóúñ']{1,}){0,}$/;
        if (regexNombre.test(nombre)) {
            this._nombre = nombre;
        }

    }

    set usuario(usuario) {
        this._usuario = usuario;
    }

    set password(password) {
        this._password = password;
    }

    set salt(salt) {
        this._salt = salt;
    }
    set tipoUsuario(tipoUsuario) {
        this._tipoUsuario = tipoUsuario;
    }

    get id() {
        return this._id;
    }
    get nombre() {
        return this._nombre;
    }
    get usuario() {
        return this._usuario;
    }
    get password() {
        return this._password;
    }

    get salt() {
        return this._salt;
    }

    get tipoUsuario() {
        return this._tipoUsuario;
    }

    get getUsuario() {
        const condid = {
            id: this.id,
            nombre: this.nombre,
            usuario: this.usuario,
            password: this.password,
            salt: this.salt,
            tipoUsuario: this.tipoUsuario
        }
        const sinid = {
            nombre: this.nombre,
            usuario: this.usuario,
            password: this.password,
            salt: this.salt,
            tipoUsuario: this.tipoUsuario
        }
        if (this.id == undefined) {
            return sinid;
        } else {
            return condid;
        }
    }
}

module.exports = Usuario;