const usuariosBD = require("./conexion").usuarios;
const Usuario = require("../modelos/UsuarioModelo");
const { encriptarPassword, validarPassword, usuarioAutorizado, adminAutorizado } = require("../middlewares/funcionesPassword");

function validarDatos(usuario) {
    var valido = false;
    if (usuario.nombre != undefined && usuario.usuario != undefined && usuario.password != undefined) {
        valido = true;
    }
    return valido;
}

async function login(req,usuario, password) {
    //console.log(usuario);
    var user={
        usuario:"anonimo",
        tipoUsuario:"sin acceso"
    }
    const usuariosCorrectos = await usuariosBD.where("usuario", "==", usuario).get();
    //console.log(usuarioCorreccto.data);
    usuariosCorrectos.forEach(usu => {
        //console.log(usu.data());
        const usuarioCorrecto=validarPassword(password,usu.data().password,usu.data().salt);
        if(usuarioCorrecto){
            user.usuario=usu.data().usuario;
            if(usu.data().tipoUsuario=="usuario"){
                req.session.usuario="usuario";
                user.tipoUsuario=req.session.usuario;
            }
            else if(usu.data().tipoUsuario=="admin"){
                req.session.admin="admin";
                user.tipoUsuario=req.session.admin;
            }
        }
    });
    //console.log(user);
    return user;
}

async function mostrarUsuarios() {
    const usuarios = await usuariosBD.get();
    usuariosValidos = [];
    usuarios.forEach(usuario => {
        const usuario1 = new Usuario({ id: usuario.id, ...usuario.data() });
        if (validarDatos(usuario1.getUsuario)) {
            usuariosValidos.push(usuario1.getUsuario);
        }
    });
    return usuariosValidos;
}

async function buscarPorID(id) {
    const usuario = await usuariosBD.doc(id).get();
    const usuario1 = new Usuario({ id: usuario.id, ...usuario.data() });
    var usuarioValido = false;
    if (validarDatos(usuario1.getUsuario)) {
        usuarioValido = usuario1.getUsuario;
    }
    return usuarioValido;
}
async function validarID(id) {
    const usuario = await usuariosBD.doc(id).get();
    if (usuario.exists) {
        return true;
    } else {
        console.log("Usuario no encontrado, id: " + id);
        return false;
    }
}

async function nuevoUsuario(data) {
    const { salt, hash } = encriptarPassword(data.password);
    data.password = hash;
    data.salt = salt;
    data.tipoUsuario = "usuario";
    const usuario1 = new Usuario(data);
    var usuarioValido = false;
    if (validarDatos(usuario1.getUsuario)) {
        await usuariosBD.doc().set(usuario1.getUsuario);
        usuarioValido = true;
    }
    return usuarioValido;
}

async function borrarUsuario(id) {
    var usuarioValido = await buscarPorID(id);
    var usuarioBorrado = false;
    if (usuarioValido) {
        await usuariosBD.doc(id).delete();
        usuarioBorrado = true;
    }
    return usuarioBorrado;
}

async function modificarUsuario(data) {
    const { salt, hash } = encriptarPassword(data.password);
    data.password = hash;
    data.salt = salt;
    var usuarioValido = await buscarPorID(data.id);
    var usuarioModificado = false;
    if (usuarioValido) {
        await usuariosBD.doc(data.id).update({
            nombre: data.nombre,
            usuario: data.usuario,
            password: data.password,
            salt: data.salt
        });
        usuarioModificado = true;
    }
    return usuarioModificado;
}

async function buscarUsuariosPorNombre(nombre) {
    const usuarios = await usuariosBD.get();
    const usuariosFiltrados = [];
    usuarios.forEach(usuario => {
        const usuario1 = new Usuario({ id: usuario.id, ...usuario.data() });
        if (usuario1.getUsuario.nombre.toLowerCase().includes(nombre.toLowerCase())) {
            usuariosFiltrados.push(usuario1.getUsuario);
        }
    });
    return usuariosFiltrados;
}

async function sugerirUsuarios(nombre) {
    const usuarios = await usuariosBD.get();
    const usuariosSugeridos = [];
    usuarios.forEach(usuario => {
        const usuario1 = new Usuario({ id: usuario.id, ...usuario.data() });
        const nombreUsuario = usuario1.getUsuario.usuario.toLowerCase();
        if (nombreUsuario.startsWith(nombre.toLowerCase())) {
            usuariosSugeridos.push(usuario1.getUsuario);
        }
    });
    return usuariosSugeridos;
}

module.exports = {
    buscarPorID,
    mostrarUsuarios,
    nuevoUsuario,
    borrarUsuario,
    validarID,
    modificarUsuario,
    login,
    buscarUsuariosPorNombre,
    sugerirUsuarios
}