import models from "../models";
function paddy(num, padlen, padchar) {
  var pad_char = typeof padchar !== "undefined" ? padchar : "0";
  var pad = new Array(1 + padlen).join(pad_char);
  return (pad + num).slice(-pad.length);
}

//Cuenta por cobrar
async function crearCPC(data) {
  try {
    const reg = await models.cuentasporcobrar
      .create(data)
      .then(async (result) => {
        return true;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  } catch (error) {
    console.log(error);
    return false;
  }
}
//Stock
async function disminuirStock(codigoArticulo, fTotales) {
  let { fraccionesTotales } = await models.inventario_esquema.findOne({
    _id: codigoArticulo,
  });
  let nfraccionesTotales = parseInt(fraccionesTotales) - parseInt(fTotales);
  if (parseInt(nfraccionesTotales) >= 0) {
    const reg = await models.inventario_esquema
      .findByIdAndUpdate(
        { _id: codigoArticulo },
        {
          fraccionesTotales: nfraccionesTotales,
          
        }
      )
      .then(async (result) => {
        return result;
      })
      .catch((err) => {
        return err;
      });
  } else {
    const reg = await models.inventario_esquema
      .findByIdAndUpdate(
        { _id: codigoArticulo },
        {
          fraccionesTotales: 0,
   
        }
      )
      .then(async (result) => {
        return result;
      })
      .catch((err) => {
        return err;
      });
  }
}
async function aumentarStock(codigoArticulo, fTotales) {
  let { fraccionesTotales } = await models.inventario_esquema.findOne({
    _id: codigoArticulo,
  });
  let nfraccionesTotales = parseInt(fraccionesTotales) + parseInt(fTotales);

  const reg = await models.inventario_esquema
    .findByIdAndUpdate(
      { _id: codigoArticulo },
      {
        fraccionesTotales: nfraccionesTotales,
        percha: "",
        numComprobante: "",
      }
    )
    .then(async (result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
}
export default {
  add: async (req, res, next) => {
    try {
      const reg = await models.facturacion.create(req.body);

      res.status(200).json(reg);
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error al intentar agregar facturacion." + e,
      });
      next(e);
    }
  },
  query: async (req, res, next) => {
    try {
      const reg = await models.facturacion
        .findOne({ _id: req.query._id })
        .populate([
          { path: "codigoBodega", model: "bodega" },
          { path: "codigoUsuario", model: "usuario" },
          { path: "codigoCliente", model: "cliente" },
          { path: "codigoDistribuidor", model: "distribuidor" },
        ]);
      if (!reg) {
        res.status(404).send({
          message: "El registro no existe.",
        });
      } else {
        res.status(200).json(reg);
      }
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error al buscar el registro de facturacion.",
      });
      next(e);
    }
  },

  list: async (req, res, next) => {
    try {
      let valor = req.query.valor;
      const reg = await models.facturacion
        .find({ $and: [{ codigoDistribuidor: req.query.codigoDistribuidor },{codigoUsuario:req.query.codigoUsuario}] })
        .populate([
          { path: "codigoBodega", model: "bodega" },
          { path: "codigoUsuario", model: "usuario" },
          { path: "codigoCliente", model: "cliente" },
          { path: "codigoDistribuidor", model: "distribuidor" },
        ]);
      // .sort({'descripcion':1});
      //console.log(reg);
      if (!reg){
        res.status(206).send({
            message: 'No se han encontrados registros'
        });
    } else{
        res.status(200).json(reg);
    }
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error al intentar listar." + e,
      });
      next(e);
    }
  },
  updateNumComprobante: async (req,res,next) => {
    try {
        const reg = await models.facturacion.findByIdAndUpdate(
          { _id: req.body._id },
          {
            claveAcceso:req.body.claveAcceso
          },
            );

        res.status(200).json(reg);
    } catch(e){
        res.status(500).send({
            message:'Ocurrió un error al actualizar el facturacion.'
        });
        next(e);
    }
},
  update: async (req,res,next) => {
      try {
          const reg = await models.facturacion.findByIdAndUpdate(
            { _id: req.body._id },
            {
              detalles:req.body.detalles,
              formaPago:req.body.formaPago,
              totalImpuesto: req.body.totalImpuesto,
              totalDescuento: req.body.totalDescuento,
              total: req.body.total,
              subTotal: req.body.subTotal,
              codigoCliente:req.body.codigoCliente
            },
              );

          res.status(200).json(reg);
      } catch(e){
          res.status(500).send({
              message:'Ocurrió un error al actualizar el facturacion.'
          });
          next(e);
      }
  },
  // remove: async (req,res,next) => {
  //     try {
  //         const reg = await models.facturacion.findByIdAndDelete({_id:req.query._id},function (err,data) {
  //             if(err) return err
  //             if(data){
  //                 const verificacionEliminar = eliminar(data.numComprobante,data.codigoDistribuidor)
  //                 if(verificacionEliminar){
  //                     res.status(200).json("ok");
  //                 }else{
  //                     res.status(500).send({
  //                         message:'Ocurrió un error al intentar eliminar el registro de la cuarentena.'
  //                     });
  //                 }
  //             }
  //         });
  //         // res.status(200).json(reg);
  //     } catch(e){
  //         res.status(500).send({
  //             message:'Ocurrió un error al intentar eliminar el facturacion.'
  //         });
  //         next(e);
  //     }
  // },
  activate_facturacion: async (req, res, next) => {
    try {
      const reg = await models.facturacion.findByIdAndUpdate(
        { _id: req.body._id },
        { estado: 1 },
        async function (err, data) {
          if (err) return err;
          if (data) {
            data.detalles.forEach((element) => {
              const disminuir = disminuirStock(
                element._id,
                element.cantidad
              );
              disminuir
                .then((result) => {
                  res.status(200).json("ok");
                })
                .catch((err) => {
                  return err;
                });
            });
          }
        }
      );
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error al intentar activar el facturacion.",
      });
      next(e);
    }
  },
  deactivate_facturacion: async (req, res, next) => {
    try {
      const reg = await models.facturacion.findByIdAndUpdate(
        { _id: req.body._id },
        { estado: 0 },
        function (err, data) {
          if (err) return err;
          if (data) {
            data.detalles.forEach((element) => {
              const aumentar = aumentarStock(
                element._id,
                element.cantidad
              );
              aumentar
                .then((result) => {
                  res.status(200).json("ok");
                })
                .catch((err) => {
                  return err;
                });
            });
          }
        }
      );
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error al intentar desactivar el facturacion.",
      });
      next(e);
    }
  },
  // AumentarNumComp: async (req, res, next) => {
  //     try {
  //         const reg = await models.facturacion.estimatedDocumentCount({codigoDistribuidor:req.query.codigoDistribuidor},function (err, count) {
  //             if (err) return handleError(err);

  //             let contadorEntero = parseInt(count) + 1
  //             res.status(200).json(paddy(parseInt(contadorEntero), 9))

  //         });

  //     } catch (e) {
  //         res.status(500).send({
  //             message: 'Ocurrió un error'
  //         });
  //         next(e);
  //     }
  // },
};
