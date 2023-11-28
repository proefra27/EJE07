const bcrypt = require('bcrypt')
const Usuarios = require('../models/usuario.model')

exports.getAllUser = async(req,res)=>{
    try {
        const listadoUsuarios = await Usuarios.find();
        if(listadoUsuarios){
            res.status(200).json({
                estado  : 1,
                mensaje : "Usuarios encontrados",
                usuarios: listadoUsuarios //[]
            });
        }else{
            res.status(404).json({
                estado  : 0,
                mensaje : "Usuarios no encontrados",
                usuarios: []               //[]
            })
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            estado  : 0,
            mensaje : "Ocurrio un error desconocido",
            usuarios: [] 
        })
    }
}

exports.getUserByEmail = async(req,res)=>{
    try {
        const { correo } = req.params;
        const usuario = await Usuarios.findOne({correo:correo}).exec();
        if(usuario){
            res.status(200).json({
                estado   : 1,
                mensaje  : "Usuario encontrado",
                usuarios : [usuario] //La solicitud de cambio de respuesta de la API se fue al SPAM
            })
        }else{
            res.status(404).json({
                estado   : 0,
                mensaje  : "Usuario no encontrado",
                usuarios : []
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            estado   : 0,
            mensaje  : "Ocurrio un error desconocido",
            usuarios : []
        })
    }
}

exports.addUser = async(req, res)=>{
    try{
        const{nombres, apellidos, usuario, correo, clave} = req.body;
        if(nombres == undefined || apellidos == undefined || usuario == undefined || correo == undefined || clave == undefined){
           res.status(400).json({
            estado:0,
            mensaje:"Faltan parametros",
            usuarios: []
           })
           //Falta encriptar la clave
        }else{
            const usuarioEncontrado = await Usuarios.findOne({$or:[{correo:correo},{usuario:usuario}]}).exec();
            if(usuarioEncontrado){
                res.status(200).json({
                    estado : 0,
                    mensaje: "Usuario y/o email ya existen",
                    usuarios: []
                })
            }else{
                const NuevoUsuario = await Usuarios.create({nombres, apellidos, usuario, correo, clave})
                if(NuevoUsuario){
                    res.status(200).json({
                        estado:1,
                        mensaje:"Usuario creado con éxito",
                        usuarios:[NuevoUsuario]
                    })
                }else{
                    res.status(500).json({
                        estado:0,
                        mensaje:"Ocurrió un error desconocido",
                        usuarios: []
                    })
                }
            }
        }  
    }catch(error){
        res.status(500).json({
            estado:0,
            mensaje:"Ocurrió un error desconocido",
            usuarios: []
        })
        //Programador
        console.log(error);
    }
}

exports.updateUser = async(req,res)=>{
    try {
        //Que datos actualizamos
        const { correo }                   = req.params;
        const { nombre, apellidos, clave } = req.body;
        if(nombre==undefined || apellidos==undefined || clave == undefined)
        {
            res.status(400).json({
                estado:0,
                mensaje:"Faltan parametros",
                usuarios: []
            })
        }else{
            //Se requiere encriptar la nueva clave
            const salt            = await bcrypt.genSalt(8);
            const claveEncriptada = await bcrypt.hash(clave,salt);   
            await Usuarios.findOneAndUpdate(
                {correo:correo}, //Condicion o Filtro
                {nombre:nombre,apellidos:apellidos,clave:claveEncriptada} //Campos
            )
            res.status(200).json({
                estado:1,
                mensaje:"El registro se actualizo correctamente",
                usuarios: []
            })
        }    
    } catch (error) {
       console.log(error);
       res.status(500).json({
            estado:0,
            mensaje:"Ocurrio un error desconocido",
            usuarios: []
       })
    }
}

exports.deleteUser = async(req,res)=>{
    try {
        const { correo } = req.params;
        const usuario = await Usuarios.findOne({correo:correo}).exec();
        if(usuario){
            await Usuarios.deleteOne(usuario)
            res.status(200).json({
                estado  : 1,
                mensaje : "Usuario eliminado",
                usuarios: []
            })
        }else{
            res.status(404).json({
                estado  : 0,
                mensaje : "Usuario no encontrado",
                usuarios: []
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            estado  : 0,
            mensaje : "Ocurrio un error desconocido",
            usuarios: []
        })
    }
}
