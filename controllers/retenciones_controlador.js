import models from '../models';
async function agregarTotalRetenido(_idCompra,TotalRetenido) {
    const reg = await models.compras.findByIdAndUpdate(
        {_id:_idCompra},{
            totalRetenido:TotalRetenido,
           
        }).then(async (result) => {
            return result
        }).catch((err) => {
            return err
        });
  }
  async function quitarTotalRetenido(_idCompra) {
      const reg = await models.compras.findByIdAndUpdate(
          {_id:_idCompra},{
              totalRetenido:0,
             
          }).then(async (result) => {
              return result
          }).catch((err) => {
              return err
          });
    }
  async function agregarTotalRetenido_CP(codigoCompra,TotalRetenido) {
    let { numComprobante } = await models.compras.findOne({ _id: codigoCompra });//FRACCIONES TOTALES Y FRACCIONES POR CAJA EN ARTICULOS

    const reg = await models.cuentasporpagar.update(
        {numComprobanteFactura:numComprobante},{
            $set:{
                "totalRetenido":TotalRetenido,
                "totalPagado":TotalRetenido
            }
        }).then(async (result) => {
            return result
        }).catch((err) => {
            return err
        });
  }
  async function quitarTotalRetenido_CP(codigoCompra) {
    let { numComprobante } = await models.compras.findOne({ _id: codigoCompra });//FRACCIONES TOTALES Y FRACCIONES POR CAJA EN ARTICULOS

    const reg = await models.cuentasporpagar.update(
        {numComprobanteFactura:numComprobante},{
            $set:{
                "totalRetenido":0,
                "totalPagado":0
            }
        }).then(async (result) => {
            return result
        }).catch((err) => {
            return err
        });
  }
export default {
    add: async (req,res,next) =>{
        try {
            const reg = await models.retenciones.create(req.body);
            let totalValRet=0
            req.body.impuestos.forEach(x => {
                totalValRet=totalValRet+parseFloat(x.valorRetenido)
            });
            const fx0 = agregarTotalRetenido_CP(req.body.codigoCompra,totalValRet)
            const fx  = agregarTotalRetenido(req.body.codigoCompra,totalValRet)
            fx.then((result) => {
                fx0.then((result2) => {
                    res.status(200).json("ok");
                }).catch((err) => {
                    res.status(500).send({
                        message:'Ocurrió un error al intentar actualizar el valor de retencion en CTAXPAGAR.'+err
                    });
                });

            }).catch((err) => {
                res.status(500).send({
                    message:'Ocurrió un error al intentar actualizar el valor de retencion en el total de la compra.'+err
                });
            });

        } catch (e){
            res.status(500).send({
                message:'Ocurrió un error al intentar agregar la retencion.'+e
            });
            next(e);
        }
    },
    query: async (req,res,next) => {
        try {
            const reg=await models.retenciones.findOne({_id:req.query._id}).populate([
                {path:'codigoCompra', model:'compras'},
                {path:'codigoUsuario', model:'usuario'},
                {path:'codigoProveedor', model:'proveedor'},
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
    list: async (req,res,next) => {
        try {
            let valor=req.query.valor;
            const reg=await models.retenciones
            .find({$and:[{codigoDistribuidor:req.query.codigoDistribuidor}]})
            .populate([
                {path:'codigoCompra', model:'compras'},
                {path:'codigoUsuario', model:'usuario'},
                {path:'codigoProveedor', model:'proveedor'},
                {path:'codigoDistribuidor', model:'distribuidor'},
                ])
            // .sort({'descripcion':1});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar listar.'+e
            });
            next(e);
        }
    },

    remove: async (req,res,next) => {
        try {
            const reg = await models.retenciones.findByIdAndDelete({_id:req.query._id});
                res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar eliminar el compras.'
            });
            next(e);
        }
    },
    activate: async (req,res,next) => {
        try {
            let totalretenido=0
            const reg = await models.retenciones.findByIdAndUpdate({_id:req.body._id},{estado:1});
            reg.impuestos.forEach( x => {
                totalretenido=totalretenido+parseFloat(x.valorRetenido)
                });
            const fx0 = agregarTotalRetenido(reg.codigoCompra,totalretenido)
            const fx1 = agregarTotalRetenido_CP(reg.codigoCompra,totalretenido)
            fx0.then((result) => {
              fx1.then((result) => {

                }).catch((err) => {
                  res.status(500).send({
                      message:'Ocurrió un error al intentar agregar el valor de la retencion a la cuenta por pagar.'
                  });
                  });
                }).catch((err) => {
                  res.status(500).send({
                      message:'Ocurrió un error al intentar agregar el valor de la retencion a la compra.'
                  });
                });
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar activar el Rol_esquema.'
            });
            next(e);
        }
    },
    deactivate:async (req,res,next) => {
        try {
            const reg = await models.retenciones.findByIdAndUpdate({_id:req.body._id},{estado:0});
            const fx0 = quitarTotalRetenido(reg.codigoCompra)
            const fx1 = quitarTotalRetenido_CP(reg.codigoCompra)
            fx0.then((result) => {
               fx1.then((result) => {
                      res.status(200).json('ok');

                 }).catch((err) => {
                   res.status(500).send({
                       message:'Ocurrió un error al intentar quitar el valor retenido en la cuenta por pagar.'
                   });
                   });
              }).catch((err) => {
                res.status(500).send({
                    message:'Ocurrió un error al intentar quitar el valor retenido en la compra.'
                });
                });

        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar desactivar el Rol_esquema.'
            });
            next(e);
        }
    },
    buscar:async(req, res,next)=>{
      try {
          let codigoProveedor = req.query.codigoProveedor
          let numComprobante  = req.query.numComprobante

          let reg=[]
          if(numComprobante.length!==0){

            reg=await models.retenciones
              .find(
                  {$and:[
                         { createdAt: { "$gte": req.query.finicio, "$lt": req.query.ffin }},
                        ]
                   }
                   )
           .populate([
             {path:'codigoCompra', model:'compras'},
             {path:'codigoUsuario', model:'usuario'},
             {path:'codigoProveedor', model:'proveedor'},
             {path:'codigoDistribuidor', model:'distribuidor'},
              ])
              let data=[]
              reg.forEach((item, i) => {
                if(item.codigoCompra){
                  if(item.codigoCompra.numComprobante==numComprobante)
                    data.push(item)
                }

              });


              if(data.length==0){
                res.status(209).send({
                    message:'No hay datos para el filtro dado.'
                });
              }else{
                  res.status(200).json(data);
              }
          }else if (codigoProveedor.length!==0) {

              reg=await models.retenciones
                .find(
                    {$and:[
                           { createdAt: { "$gte": req.query.finicio, "$lt": req.query.ffin }},
                           {codigoProveedor:codigoProveedor}
                          ]
                     }
                     )
             .populate([
               {path:'codigoCompra', model:'compras'},
               {path:'codigoUsuario', model:'usuario'},
               {path:'codigoProveedor', model:'proveedor'},
               {path:'codigoDistribuidor', model:'distribuidor'},
                ])
                if(reg.length==0){
                  res.status(209).send({
                      message:'No hay datos para el filtro dado.'
                  });
                }else{
                    res.status(200).json(reg);
                }

          } else {

                  reg=await models.retenciones
                    .find(
                        {$and:[
                               { createdAt: { "$gte": req.query.finicio, "$lt": req.query.ffin }}
                              ]
                         }
                         )
                 .populate([
                   {path:'codigoCompra', model:'compras'},
                   {path:'codigoUsuario', model:'usuario'},
                   {path:'codigoProveedor', model:'proveedor'},
                   {path:'codigoDistribuidor', model:'distribuidor'},
                    ])
                    if(reg.length==0){
                      res.status(209).send({
                          message:'No hay datos para el filtro dado.'
                      });
                    }else{
                        res.status(200).json(reg);
                    }
          }





      } catch(e){
          res.status(500).send({
              message:'Ocurrió un error al buscar el registro de inventario_esquema.'+e
          });
          next(e);
      }
    }
}
