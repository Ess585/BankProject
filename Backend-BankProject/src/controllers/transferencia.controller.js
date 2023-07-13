'use strict'

const Transferencia = require('../models/transferencia.model');
const User = require('../models/user.model');

const makeTransfer = async(req, res) => {
    const { sendernNumberAccount, recipientNumberAccount, name, nickname, amount} = req.body;
    try{

      const cuentaReceptor = await User.findOne({ numberAccount: recipientNumberAccount });
      if(!cuentaReceptor) {
        throw new Error('Número de cuenta de emisor no existente');
      }  

      const cuentaEmisor = await User.findOne({ numberAccount: sendernNumberAccount });
      if(!cuentaEmisor) {
        throw new Error('Número de cuenta del receptor no existente');
      }

      const userReceptor = await User.findOne({ name: name, nickname: nickname });
      if(!userReceptor) {
        throw new Error('Usuario receptor no encontrado');
      }

      if(cuentaEmisor.saldo < amount) {
        throw new Error('Saldo insuficiente en la cuenta del emisor');
      }

      cuentaEmisor.saldo -= amount;
      cuentaReceptor.saldo += amount;

      await cuentaEmisor.save();
      await cuentaReceptor.save();

      const transfer = await Transferencia({
        numberAccount: recipientNumberAccount,
        name: userReceptor._id,
        nickname: userReceptor._id,
        saldo: cuentaReceptor._id,
        amount,
      });

      await transfer.save();

      console.log('¡Transferencia existosa!');
    }catch(error){
        console.log(error)
        res.status(500).json({
            message: 'Hubo un error al realizar transferencia'
        })
    }
}

module.exports = { makeTransfer }