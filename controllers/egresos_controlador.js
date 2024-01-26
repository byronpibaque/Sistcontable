import models from '../models';
function paddy(num, padlen, padchar) {
    var pad_char = typeof padchar !== 'undefined' ? padchar : '0';
    var pad = new Array(1 + padlen).join(pad_char);
    return (pad + num).slice(-pad.length);
}
async function crearCPC(data){
    try {
        const reg = await models.cuentasporcobrar.create(data)
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
async function disminuirStock(codigoArticulo,fTotales) {
    let { fraccionesTotales } = await models.inventario_esquema.findOne( { _id: codigoArticulo });

    let nfraccionesTotales = parseInt(fraccionesTotales) - parseInt(fTotales)

    if(parseInt(nfraccionesTotales) >= 0 ){
        await models.inventario_esquema.findByIdAndUpdate(
            { _id: codigoArticulo }, { fraccionesTotales: nfraccionesTotales }
            ).then(async (result) => { return result })
            .catch((err) => { return err });
    }else {
        await models.inventario_esquema.findByIdAndUpdate(
            {_id:codigoArticulo},{ fraccionesTotales: 0, percha: "", numComprobante:""})
            .then(async (result) => { return result })
            .catch((err) => { return err });
    }
     
  }
async function aumentarStock(codigoArticulo,fTotales) {
    let {fraccionesTotales} = await models.inventario_esquema.findOne({_id:codigoArticulo})
    let nfraccionesTotales = parseInt(fraccionesTotales)+parseInt(fTotales)
 
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
    add: async (req,res,next) =>{
        try {
            const reg = await models.egreso.create(req.body);
       
            res.status(200).json(reg);
        } catch (e){
            res.status(500).send({
                message:'Ocurrió un error al intentar agregar egreso.'+e
            });
            next(e);
        } 
    },
    query: async (req,res,next) => {
        try {
            const reg=await models.egreso.findOne({_id:req.query._id})
            .populate([
                {path:'codigoBodega', model:'bodega'},
                {path:'codigoUsuario', model:'usuario'},
                {path:'codigoCliente', model:'cliente'},
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
                message:'Ocurrió un error al buscar el registro de egreso.'
            });
            next(e);
        }
    },
    // queryReten: async (req,res,next) => {
    //     try {
    //         let valor = req.query.valor
    //         const reg=await models.egreso.find(
    //             {$and:[{"codigoDistribuidor":req.query.codigoDistribuidor},
    //             {$or:[
    //                 {'codigoProveedor.ruc': new RegExp('^'+valor,'i')},
    //                 {'codigoProveedor.ruc':  new RegExp(valor+'$','i')},
    //                 {'codigoProveedor.ruc':new RegExp(valor,'i')},
    //                 {'numComprobante':new RegExp(valor,'i')},
    //                 {'numComprobante': new RegExp('^'+valor,'i')},
    //                 {'numComprobante':  new RegExp(valor+'$','i')},    
    //             ]}]})
    //             .populate([
    //             {path:'codigoBodega', model:'bodega'},
    //             {path:'codigoUsuario', model:'usuario'},
    //             {path:'codigoProveedor', model:'proveedor'},
    //             {path:'codigoDistribuidor', model:'distribuidor'},
    //             ])
       
    //             res.status(200).json(reg);
          
    //     } catch(e){
    //         res.status(500).send({
    //             message:'Ocurrió un error al buscar el registro de egreso.'+e
    //         });
    //         next(e);
    //     }
    // },
    list: async (req,res,next) => {
        try {
            let valor=req.query.valor;
            const reg=await models.egreso.find({$and:[{codigoDistribuidor:req.query.codigoDistribuidor}]}).populate([
                {path:'codigoBodega', model:'bodega'},
                {path:'codigoUsuario', model:'usuario'},
                {path:'codigoCliente', model:'cliente'},
                {path:'codigoDistribuidor', model:'distribuidor'}
                ])
                .sort({$natural:-1});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar listar.'+e
            });
            next(e);
        }
    },
    // update: async (req,res,next) => {
    //     try {         
    //         const reg = await models.egreso.findByIdAndUpdate({_id:req.body._id},
    //             {
    //             //  descripcion:req.body.descripcion,
    //             //  codigoUsuario:req.query.codigoUsuario
    //             });
                    
    //         res.status(200).json(reg);
    //     } catch(e){
    //         res.status(500).send({
    //             message:'Ocurrió un error al actualizar el egreso.'
    //         });
    //         next(e);
    //     }
    // },
    // remove: async (req,res,next) => {
    //     try {
    //         const reg = await models.egreso.findByIdAndDelete({_id:req.query._id},function (err,data) {
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
    //             message:'Ocurrió un error al intentar eliminar el egreso.'
    //         });
    //         next(e);
    //     }
    // },
    activate_Egreso: async (req,res,next) => {
        try {     
                await models.egreso.findByIdAndUpdate({_id:req.body._id}, { estado: 1 }, async function (err, data) {
                if(err) return err;
                if(data){
                    await models.cuentasporcobrar.estimatedDocumentCount( async function (err, count) {
                        if (err) return handleError(err);
                        // console.log( data );
                        let contadorEntero = parseInt(count) + 1

                        let vall = paddy(parseInt(contadorEntero), 9)

                        data.formaPago.forEach(e => {
                            let datosCPC = {                              
                                numComprobante: vall,
                                totalFormaPago: e.total,
                                plazo:e.plazo,
                                unidadTiempo: e.unidadTiempo,
                                codigoEgreso:data.codigoEgreso,
                                codigoCliente: data.codigoCliente,
                                codigoDistribuidor: data.codigoDistribuidor,
                                codigoUsuario: data.codigoUsuario,
                                totalFactura: data.total,
                                numComprobanteDocumento: data.numComprobante,
                                fechaFactura: data.fechaFactura,
                                descripcion: data.descripcion,
                            }
                            data.detalles.forEach(element => {
                                const disminuir = disminuirStock(element._id,element.fraccionesTotales);
                                disminuir.then((result) => { res.status(200).json("ok"); }).catch((err) => {
                                 return err
                                });
                            });
                            if (e.unidadTiempo=="NINGUNO") {
                                res.status(200).json("ok");
                            }else{
                                //Crear cuenta por cobrar
                                const fx = crearCPC(datosCPC)
                                fx.then((result) => {
                                    res.status(200).json("ok");
                                }).catch((err) => {
                                 res.status(500).send({
                                     message:'Ocurrió un error al intentar crear la cuenta por cobrar.'+err
                                 }); 
                                });
                            }
                        });
                    });
                }
            });
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar activar el egreso.'
            });
            next(e);
        }
    },
    deactivate_Egreso:async (req,res,next) => {
        try {
            await models.egreso.findByIdAndUpdate({_id:req.body._id},{ estado: 0 },function (err, data) {      
                if(err) return err
                if(data){
                    data.detalles.forEach(element => {
                        const aumentar = aumentarStock(element._id,element.fraccionesTotales);
                        aumentar.then((result) => {
                            res.status(200).json("ok");   
                        }).catch((err) => {
                         return err   
                        });
                    });
                }
            })
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar desactivar el egreso.'
            });
            next(e);
        }
    },
    AumentarNumComp: async (req, res, next) => {
        try {
            const reg = await models.egreso.estimatedDocumentCount({codigoDistribuidor:req.query.codigoDistribuidor},function (err, count) {
                if (err) return handleError(err);

                let contadorEntero = parseInt(count) + 1
                res.status(200).json(paddy(parseInt(contadorEntero), 9))


            });


        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    eliminarEgreso: async (req,res,next) => {
        try {
            const egreso = await models.egreso.deleteOne({_id: req.params.egreso_id})
            res.json({ egreso, msg: 'ok' });
        } catch(e){
            res.status(500).send({ message:'Ocurrió un error al intentar desactivar el egreso.' });
            next(e);
        }
    },
}
