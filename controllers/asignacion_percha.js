import models from "../models";

async function aumentarStock(
    codigoArticulo,costoNeto1,pvm1,pvp1,punit1,fTotales,percha1,numComprobante1, temperatura
    ) {
    //Obtener cuanto de total lleva
    let { fraccionesTotales } = await models.inventario_esquema.findOne({_id:codigoArticulo})

    let nfraccionesTotales = parseInt(fraccionesTotales) + parseInt(fTotales)

    await models.inventario_esquema.findByIdAndUpdate({ _id: codigoArticulo },{
        fraccionesTotales:  nfraccionesTotales,
        costoNeto:          costoNeto1,
        pvm:                pvm1,
        pvp:                pvp1,
        punit:              punit1,
        percha:             percha1,
        numComprobante:     numComprobante1,
        $addToSet : {
          detalle : {
            numComprobante: numComprobante1,
            percha:         percha1,
            cantidad:       fTotales,
            temperatura:    temperatura
          }
        }
    }).then(async (result) => {
        return result
    }).catch((err) => {
        return err
    }); 
}

async function disminuirStock(codigoArticulo,costoNeto1,pvm1,pvp1,punit1,fTotales) {
  let {fraccionesTotales} = await models.inventario_esquema.findOne({_id:codigoArticulo})
  let nfraccionesTotales = parseInt(fraccionesTotales)-parseInt(fTotales)
  const reg = await models.inventario_esquema.findByIdAndUpdate(
      {_id:codigoArticulo},{
          fraccionesTotales:nfraccionesTotales
      }).then(async (result) => {
          return result
      }).catch((err) => {
          return err
      }); 
}

export default {
  add: async (req, res, next) => {
    try {
      const reg = await models.asignacionPercha.create(req.body);
      res.status(200).json(reg);
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error al intentar agregar asignacionPercha." + e,
      });
      next(e);
    }
  },
  query: async (req,res,next) => {
    try {
        const reg=await models.asignacionPercha.findOne({_id:req.query._id}).populate([
            {path:'codigoBodega', model:'bodega'},
            {path:'codigoUsuario', model:'usuario'},
            // {path:'codigoProveedor', model:'proveedor'},
            {path:'codigoDistribuidor', model:'distribuidor'},
            ])
        if (!reg){
            res.status(404).send({
                message: 'El registro no existe.'
            });
        } else{
            res.status(200).json(reg);
        }
    } catch(e){
        res.status(500).send({
            message:'Ocurrió un error al buscar el registro de compras.'
        });
        next(e);
    }
},
  list: async (req, res, next) => {
    try {
      let valor = req.query.valor;
      const reg = await models.asignacionPercha.find(
          {$and:[{codigoDistribuidor:req.query.codigoDistribuidor}]}
        ).populate([
          {path:'codigoBodega', model:'bodega'},
          {path:'codigoUsuario', model:'usuario'},
          // {path:'codigoProveedor', model:'proveedor'},
          {path:'codigoDistribuidor', model:'distribuidor'},
        ]).sort({ $natural: -1 });
      res.status(200).json(reg);
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error al intentar listar los asignacionPerchaes.",
      });
      next(e);
    }
  },
  update: async (req, res, next) => {
    try {
      console.log( req.body );
      await models.asignacionPercha.findByIdAndUpdate(
        { _id: req.body._id }, {
          numComprobante:req.body.numComprobante,
          descripcion:req.body.descripcion,
          detalles:req.body.detalles,
          codigoDistribuidor:req.body.codigoDistribuidor,
          codigoUsuario:req.body.codigoUsuario,
          codigoBodega:req.body.codigoBodega,
          estado: 1
        }, async function (err,data) {
          if(err) return err
          if(data){
            req.body.detalles.forEach(l => {
              const aumentar = aumentarStock(l._id,l.costoNeto,l.pvm,l.pvp,l.punit,l.fraccionesTotales,l.percha,req.body.numComprobante, l.temperatura)

              aumentar.then((result) => {
                res.status(200).json("ok");
              }).catch((err) => {
                    return err                
              });
            });
          }
        }
      );
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error al actualizar."+e,
      });
      next(e);
    }
  },
  remove: async (req, res, next) => {
    try {
      const reg = await models.asignacionPercha.findByIdAndDelete({
        _id: req.query._id,
      });
      res.status(200).json(reg);
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error al intentar eliminar el asignacionPercha.",
      });
      next(e);
    }
  },
  activar_detalle: async (req, res, next) => {
    try {
      const reg = await models.asignacionPercha.update(
        {
          "detalles._id": req.body._id,
        },
        {
          $set: {
            "detalles.$.estado": 1,
          },
        },
        async function (err, data) {
          if (err) return err;
          if (data) {
            const reg2 = await models.asignacionPercha.update(
              {
                "detalles._id": req.body._id,
              },
              {
                $set: {
                  "detalles.$.estado": 1,
                },
              },
              async function (err, data) {
                if (err) return err;
                if (data) {
                  res.status(200).json("ok");
                }
              }
            );
          }
        }
      );
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error al actualizar el detalle de cuarentena." + e,
      });
      next(e);
    }
  },
  desactivar_detalle: async (req, res, next) => {
    try {
      const reg = await models.asignacionPercha.update(
        {
          "detalles._id": req.body._id,
        },
        {
          $set: {
            "detalles.$.estado": 0,
            "detalles.$.descripcion": req.body.descripcion,
          },
        },async function (err,data) {
            if(err) return err;
            if(data){
                const reg2 = await models.asignacionPercha.update(
                    {
                        "detalles._id": req.body._id,
                      },
                      {
                        $set: {
                          "detalles.$.estado": 0,
                          "detalles.$.descripcion": req.body.descripcion,
                        },
                      },async function (err,data) {
                          if(err) return err;
                          if(data){
                            res.status(200).json("ok"); 
                          }
                      })
            }
        })
  
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error al actualizar el detalle de cuarentena." + e,
      });
      next(e);
    }
  },
  activate: async (req, res, next) => {
    try {
      const reg = await models.asignacionPercha.findByIdAndUpdate(
        { _id: req.body._id },
        { estado: 1 }
      );
      res.status(200).json(reg);
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error al intentar activar el asignacionPercha.",
      });
      next(e);
    }
  },
  deactivate: async (req, res, next) => {
    try {
      const reg = await models.asignacionPercha.findByIdAndUpdate(
        { _id: req.body._id },
        { estado: 0 }
      );
      res.status(200).json(reg);
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error al intentar desactivar el asignacionPercha.",
      });
      next(e);
    }
  },
};
