const FAVORITO = require('../models/favorites.model');

const addUserFav = async(req, res) => {
    const { alias, tipo, DPI } = req.body;
    try{
        let userFavorito = await FAVORITO.findOne({DPI: DPI})

        if(userFavorito){
            return res.status(400).send({
                message: `Un usuario ya usa este numero de DPI: ${DPI}`,
                ok: false,
                userFavorito: userFavorito
            });
        }

        userFavorito = new FAVORITO(req.body);
        userFavorito = await userFavorito.save();

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            message: `No se pudo asignar el usuario ${alias} como favorito`,
            error: error,
        })
    }
};

const readUserFav = async(req, res) => {
    try{
        const fav = await FAVORITO.find();

        if(!fav){
            res.status(400).send({
                message: 'No hay usuarios disponibles'
            })
        }else {
            res.status(200).json({"Usuarios encontrados": fav})
        }

    }catch(error){
        throw new Error(error);
    }
};

//Eliminar Usuarios
const deleteUserFav = async(req, res) => {
    try{
        const id = req.params.id;
        const fav = await FAVORITO.findById(id)

        if(!user){
            return res.status(404).json({
                message: 'Usuario no encontrado'
            })
        }

        await fav.remove();
        res.json({
            message: 'Usuario eliminado correctamente'
        })

    }catch(error){
        res.status(500).json('Error en el servidor')
        console.log(error)
    }
};

module.exports = { addUserFav, readUserFav, deleteUserFav }