import models from '../models';
import comprasService from '../services/comprasService';
function paddy(num, padlen, padchar) {
    var pad_char = typeof padchar !== 'undefined' ? padchar : '0';
    var pad = new Array(1 + padlen).join(pad_char);
    return (pad + num).slice(-pad.length);
}

async function crearCPP(data){
    try {
        const reg = await models.cuentasporpagar.create(data)
        .then(async(result) => {
            return true
        }).catch((err) => {
            console.log(err);
            return false
        }); 
    } catch (error) {
        console.log(error);
        return false
    }
}
async function crear(data){
    try {
        const reg = await models.cuarentenas.create(data).then(async(result) => {
            // console.log("Creaacion cuarentena OK \n"+result);
            const reg2 = await models.asignacionPercha.create(data).then(async (result) => {
                // console.log("Creacion asignacion OK! \n"+result);
                return true
            }).catch((err) => {
                console.log(err);
                 return false
            });
            
        }).catch((err) => {
            console.log(err);
            return false
        }); 
    } catch (error) {
        console.log(error);
        return false
    }
}
async function eliminar(numComprobante,codigoDistribuidor) {
    try {
        const resultado = await models.cuarentenas.deleteOne({$and:[{numComprobante:numComprobante},{codigoDistribuidor:codigoDistribuidor}]})
        .then(async (result) => {
            
            const resultado2 = await models.asignacionPercha.deleteOne({$and:[{numComprobante:numComprobante},{codigoDistribuidor:codigoDistribuidor}]})
            .then(async(result) => {
                const resultado3 = await models.cuentasporpagar.deleteOne({$and:[{numComprobanteFactura:numComprobante},{codigoDistribuidor:codigoDistribuidor}]}).
                then((result) => {

                    return true 
                }).catch((err) => {
                    console.log(err);
                    return false
                });
           
            }).catch((err) => {
                console.log(err);
                return false
            });
        }).catch((err) => {
            console.log(err);
            return false
        });
        
    } catch (e){
        console.log(e);
        return false
    } 
}  
async function disminuirStock(codigoArticulo,costoNeto1,pvm1,pvp1,punit1,fTotales) {
    let {fraccionesTotales} = await models.inventario_esquema.findOne({_id:codigoArticulo})
    let nfraccionesTotales = parseInt(fraccionesTotales)-parseInt(fTotales)
  if(parseInt(nfraccionesTotales)>=0){
    const reg = await models.inventario_esquema.findByIdAndUpdate(
        {_id:codigoArticulo},{
            fraccionesTotales:nfraccionesTotales,
            percha:"",
            numComprobante:""
        }).then(async (result) => {
            return result
        }).catch((err) => {
            return err
        });
  }else {
    const reg = await models.inventario_esquema.findByIdAndUpdate(
        {_id:codigoArticulo},{
            fraccionesTotales:0,
            percha:"",
            numComprobante:""
        }).then(async (result) => {
            return result
        }).catch((err) => {
            return err
        });
  }
     
}

export default {
    add: async (req,res,next) =>{
            let numeroComp = (req.body.numComprobante).trim();
            try {
              const result = await comprasService.verificaNumComprobante(numeroComp);
              if (result === true) {
                throw new Error("Ya existe un registro con el mismo número de comprobantes");
              } else {
                req.body.detalles.forEach( async (detalle) => {
                    await models.inventario_esquema.findByIdAndUpdate( detalle._id, 
                        { $set:{ fechaIngresoBodega: req.body.fechaIngresoBodega }
                    });
                }); 
                const reg = await models.compras.create(req.body);
            
                await models.cuarentenas.create({
                  numComprobante: req.body.numComprobante,
                  descripcion: req.body.descripcion,
                  detalles: req.body.detalles,
                  codigoUsuario: req.body.codigoUsuario,
                  codigoDistribuidor: req.body.codigoDistribuidor,
                  codigoBodega: req.body.codigoBodega,
                  codigoProveedor: req.body.codigoProveedor,
                });
            
                await models.asignacionPercha.create({
                  numComprobante: numeroComp,
                  descripcion: req.body.descripcion,
                  detalles: req.body.detalles,
                  codigoUsuario: req.body.codigoUsuario,
                  codigoDistribuidor: req.body.codigoDistribuidor,
                  codigoBodega: req.body.codigoBodega,
                });
            
                res.status(200).json(reg);
              }
            } catch (err) {
              res.status(500).send({
                message:  err.message,
              });
              next(err);
            }
    },
    query: async (req,res,next) => {
        try {
            const reg = await models.compras.findOne({_id:req.query._id}).populate([
                {path:'codigoBodega', model:'bodega'},
                {path:'codigoUsuario', model:'usuario'},
                {path:'codigoProveedor', model:'proveedor'},
                {path:'codigoDistribuidor', model:'distribuidor'},
            ])

            if (!reg)
                res.status(404).send({ message: 'El registro no existe.' });
            else
                res.status(200).json(reg);
            
        } catch(e){
            res.status(500).send({ message:'Ocurrió un error al buscar el registro de compras.' });
            next(e);
        }
    },
    queryReten: async (req,res,next) => {
        try {
            let valor = req.query.valor
            const reg=await models.compras.find(
                {$and:[{"codigoDistribuidor":req.query.codigoDistribuidor},
                {$or:[
                    {'codigoProveedor.ruc': new RegExp('^'+valor,'i')},
                    {'codigoProveedor.ruc':  new RegExp(valor+'$','i')},
                    {'codigoProveedor.ruc':new RegExp(valor,'i')},
                    {'numComprobante':new RegExp(valor,'i')},
                    {'numComprobante': new RegExp('^'+valor,'i')},
                    {'numComprobante':  new RegExp(valor+'$','i')},    
                ]}]})
                .populate([
                {path:'codigoBodega', model:'bodega'},
                {path:'codigoUsuario', model:'usuario'},
                {path:'codigoProveedor', model:'proveedor'},
                {path:'codigoDistribuidor', model:'distribuidor'},
                ])
       
                res.status(200).json(reg);
          
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al buscar el registro de compras.'+e
            });
            next(e);
        }
    },
    list: async (req,res,next) => {
        try {
            let valor = req.query.valor;
            const reg=await models.compras.find({$and:[{codigoDistribuidor:req.query.codigoDistribuidor}]}).populate([
                {path:'codigoBodega', model:'bodega'},
                {path:'codigoUsuario', model:'usuario'},
                {path:'codigoProveedor', model:'proveedor'},
                {path:'codigoDistribuidor', model:'distribuidor'},
            ])
            .sort({$natural:-1});
            res.status(200).json(reg);
        }catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar listar.'+e
            });
            next(e);
        }
    },
    // update: async (req,res,next) => {
    //     try {         
    //         const reg = await models.compras.findByIdAndUpdate({_id:req.body._id},
    //             {
    //             //  descripcion:req.body.descripcion,
    //             //  codigoUsuario:req.query.codigoUsuario
    //             });
                    
    //         res.status(200).json(reg);
    //     } catch(e){
    //         res.status(500).send({
    //             message:'Ocurrió un error al actualizar el compras.'
    //         });
    //         next(e);
    //     }
    // },
    remove: async (req,res,next) => {
        try {
            const reg = await models.compras.findByIdAndDelete({_id:req.query._id},function (err,data) {
                if(err) return err
                if(data){
                    const verificacionEliminar = eliminar(data.numComprobante,data.codigoDistribuidor)
                    if(verificacionEliminar){
                        res.status(200).json("ok");
                    }else{
                        res.status(500).send({
                            message:'Ocurrió un error al intentar eliminar el registro de la cuarentena.'
                        }); 
                    }
                } 
            });
            // res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar eliminar el compras.'
            });
            next(e);
        }
    },
    activate_Compra: async (req,res,next) => {
        try {
            const reg = await models.compras.findByIdAndUpdate({_id:req.body._id},{estado:1}, async function (err,data) {
                if(err) return err;
                if(data){
                    const reg = await models.cuentasporpagar.estimatedDocumentCount( async function (err, count) {
                        if (err) return handleError(err);
        
        
                        let contadorEntero = parseInt(count) + 1
                        let vall=paddy(parseInt(contadorEntero), 9)
                        data.formaPago.forEach(e => {
                            let datosCPP={
                                totalRetenido:data.totalRetenido,
                                numComprobante: vall,
                                totalFormaPago: e.total,
                                plazo:e.plazo,
                                unidadTiempo: e.unidadTiempo,
                                codigoCompra:data.codigoCompra,
                                codigoProveedor: data.codigoProveedor,
                                codigoDistribuidor: data.codigoDistribuidor,
                                codigoUsuario: data.codigoUsuario,
                                totalFactura: data.total,
                                numComprobanteFactura: data.numComprobante,
                                fechaFactura: data.fechaFactura,
                                descripcion: data.descripcion,
                            }
                           const fx = crearCPP(datosCPP)
                           fx.then((result) => {
                                 
                                let info={
                                    numComprobante:data.numComprobante,
                                    descripcion:data.descripcion,
                                    detalles:data.detalles,
                                    codigoUsuario:data.codigoUsuario,
                                    codigoDistribuidor:data.codigoDistribuidor,
                                    codigoBodega:data.codigoBodega  

                                }
                                if (e.unidadTiempo=="NINGUNO") {
                                    res.status(200).json("ok");
                                }else{
                                    const verificacionCrear = crear(info)
                                    if (verificacionCrear) {
                                        res.status(200).json("ok");
                                    } else {
                                        res.status(500).send({
                                            message:'Ocurrió un error al intentar crear el registro de la cuarentena.'
                                        }); 
                                    }
                                }
                                
                           }).catch((err) => {
                               return err
                           });
                        });
        
                    });
                 
                
                }
            });
            // res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar activar el compras.'
            });
            next(e);
        }
    },
    deactivate_Compra:async (req,res,next) => {
        try {
            
            const reg = await models.compras.findByIdAndUpdate({_id:req.body._id},{estado:0},function (err,data) {      
                if(err) return err
                if(data){
                    const verificacionEliminar = eliminar(data.numComprobante,data.codigoDistribuidor)
                    data.detalles.forEach(l => {
                        const disminuir = disminuirStock(l._id,l.costoNeto,l.pvm,l.pvp,l.punit,l.fraccionesTotales)
                       disminuir.then((result) => {
                        if(verificacionEliminar){
                            res.status(200).json("ok");
                        }else{
                            res.status(500).send({
                                message:'Ocurrió un error al intentar eliminar el registro de la cuarentena.'
                            }); 
                        }
                       }).catch((err) => {
                              return err                
                       });
                      });      
                }
            })
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar desactivar el compras.'
            });
            next(e);
        }
    }
}
