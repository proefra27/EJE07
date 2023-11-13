const mongoose = require('../config/db')
const { Schema } = mongoose

//Esctrucura de la coleccion de usuarios
const usuarioSchema = new Schema({
    nombre:{
        type:String
    },
    apellidos:{
        type:String
    },
    usuario:{
        type:String,
        unique:true
    },
    correo:{
        type:String,
        unique:true
    },
    clave:{
        type:String
    }
})

//Correspondencia de la coleccion en la base de datos
const Usuario = mongoose.model('Usuario',usuarioSchema)

module.exports=Usuario;
