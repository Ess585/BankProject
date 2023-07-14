'use strict'

const Usuario = require('../models/user.model');
const bcrypt = require('bcrypt');
const { generateJWT } = require('../helpers/create-jwt');

//Administrador por defecto
const ADMINB = async(req, res) => {
    try{
        let user = new Usuario();
        user.name = "ADMINB";
        user.username = "AdminBanc";
        user.DPI = "1234079630101";
        user.address = "Guatemala, zona 6";
        user.cellphone = "37946559";
        user.email = "adminb@kinal.edu.gt";
        user.password = "ADMINB123";
        user.workName = "Gerente de Aplicaciones";
        user.rol = "ADMINB";
        const userEncontrado = await Usuario.findOne({ email: user.email });
        if(userEncontrado) return console.log("El AdminApp esta listo!");
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync());
        user = await user.save();
        if(!user) return console.log("The AdminApp No esta listo");
        return console.log("El AdminApp esta listo");
    }catch(error) {
        console.log(error)
        throw new Error(error)
    }
};

//Crear Usuarios
const createUser = async(req, res) => {
    if (req.user.rol === "ADMINB") {
    const { name, email, password } = req.body;
    try{
        let usuario = await Usuario.findOne({email: email})

        if(usuario){
            return res.status(400).send({
                message: `Un usuario ya usa el email ${email}`,
                ok: false,
                usuario: usuario
            });
        }

        usuario = new Usuario(req.body);

        //Encriptación de contraseña
        const saltos = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, saltos);

        //Guardar usuarios
        usuario = await usuario.save();

        //Crear token
        const token = await generateJWT(usuario.id, usuario.name, usuario.email)
        res.status(200).send({
            message: `Usuario ${usuario.name} creado correctamente`,
            ok: true,
            usuario,
            token: token,
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            message: `No se pudo crear el usuario ${name}`,
            error: error,
        })
    }
    } else {
        return res.status(200).send({
        message: "Este usuario no tiene permisos para crear usuarios",
    });
  }
};

//Listar usuarios
const readUser = async(req, res) => {
    try{
        const user = await Usuario.find();

        if(!user){
            res.status(400).send({
                message: 'No hay usuarios disponibles'
            })
        }else {
            res.status(200).json({"Usuarios encontrados": user})
        }
    }catch(error){
        throw new Error(error);
    }
};

//Editar Usuarios
const updateUser = async(req, res) => {
    try{
        const id = req.params.id;
        let editUser = {...req.body};

        //Encriptación de contraseña
        editUser.password = editUser.password
        ? bcrypt.hashSync(editUser.password, bcrypt.genSaltSync())
        : editUser.password

        const userComplete = await Usuario.findByIdAndUpdate(id, editUser, {
            new: true
        });

        if(userComplete) {
            const token = await generateJWT(userComplete.id, userComplete.name, userComplete.email);
            return res.status(200).send({
                message: "Usuario actualizado correctamente",
                userComplete,
                token,
            })
        }else{
            res.status(404).send({
                message: 'Este usuario no existe en la base de datos, o verifique parametros'
            })
        };

    }catch(error){
        throw new Error(error);
    }
};

//Eliminar Usuarios
const deleteUser = async(req, res) => {
    try{
        const id = req.params.id;
        const user = await Usuario.findById(id)
        
        if(!user){
            return res.status(404).json({
                message: 'Usuario no encontrado'
            })
        }

        await user.remove();

        res.json({
            message: 'Usuario eliminado correctamente'
        })

    }catch(error){
        res.status(500).json('Error en el servidor')
        console.log(error)
    }
};

//Login Usuarios
const loginUser = async(req, res) => {
    const {email, password} = req.body;
    try{
        const users = await Usuario.findOne({email});

        if(!users){
            return res.status(404).send({
                ok: false,
                message: 'No se encontro el email'
            })
        };

        const validatePassword = bcrypt.compareSync(
            password,
            users.password
        );

        if(!validatePassword){
            return res.status(400).send({
                ok: false,
                message: 'Password incorrecto'
            });
        };

        const token = await generateJWT(users.id, users.name, users.email);
        res.json({
            message: `Usuario logeado correctamente, ${users.name}`,
            ok: true,
            uId: users.id,
            name: users.name,
            email: users.email,
            token: token,
        });

    }catch(error){
        res.status(500).json({
            ok: false,
            message: 'Usuario no registrado'
        })
    }
};

//Crear Cuenta
const addAccount = async (req, res) => {
    try {
      const id = req.params.id;
      const existingCuenta = await Usuario.findOne({ name: id });

    if (existingCuenta) {
        return res.status(400).json({
        message: "El usuario ya tiene una cuenta registrada.",
        ok: false,
        account: existingCuenta,
        });
    }
      const { No, tipo, banco, saldo } = req.body;
      const balance = saldo >= 100 ? saldo : 0;
  
      const account = await Usuario.findByIdAndUpdate(
        id,
        {
          $push: {
            account: {
              No: No,
              tipo: tipo,
              banco: banco,
              saldo: saldo,
              balance
            },
          },
        },
        { new: true }
      );

      if (!account) {
        return res.status(404).send({ message: "No se pude crear la cuenta bancaria" });
      }
  
      return res.status(200).send({ account });
    } catch (err) {
      throw new Error(err);
    }
  };

  const deleteAccount = async (req, res) => {
    const id = req.params.id;
    const { idCuenta } = req.body;
    try {
      const eliminar = await Usuario.updateOne(
        { _id: id },
        { $pull: { account: { _id: idCuenta } }, },
        { new: true, multi: false }
      );
  
      if (!eliminar) {
        return res.status(404).send({ message: "Cuenta inexistente" });
      }
  
      return res.status(200).send({ message: "La cuenta ha sido eliminada correctamente" });
    } catch (error) {
      throw new Error("No se pudo eliminar la Cuenta", error);
    }
  };

  const listAccounts = async (req, res) => {
    try {
        if (!req.user || !req.user.rol) {
            return res.status(401).json({
                message: "Acceso no autorizado. Debe iniciar sesión como ADMINB.",
                ok: false,
            });
        }
        const isAdminB = req.user.rol === "ADMINB";
        if (!isAdminB) {
            return res.status(401).json({
                message: "Solo el administrador ADMINB puede listar las cuentas.",
                ok: false,
            });
        }
        const cuentas = await Cuenta.find();
        return res.status(200).json({
            message: "Lista de cuentas",
            ok: true,
            cuentas,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Ha ocurrido un error al obtener la lista de cuentas.",
            ok: false,
            error: error.message,
        });
    }
};

module.exports = {  ADMINB,
                    createUser,
                    readUser,
                    updateUser,
                    deleteUser,
                    loginUser, 
                    addAccount,
                    deleteAccount,
                    listAccounts};