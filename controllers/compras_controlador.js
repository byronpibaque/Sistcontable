import models from '../models';

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
             console.log("Cuarentena OK! \n"+result);
            const resultado2 = await models.asignacionPercha.deleteOne({$and:[{numComprobante:numComprobante},{codigoDistribuidor:codigoDistribuidor}]})
            .then(async(result) => {
             console.log("Asignacion OK! \n"+result);
                return true 
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
  }
export default {
    add: async (req,res,next) =>{
        try {
            const reg = await models.compras.create(req.body);
            const agregarCuarentena = await models.cuarentenas.create({
              numComprobante:req.body.numComprobante,
              descripcion:req.body.descripcion,
              detalles:req.body.detalles,
              codigoUsuario:req.body.codigoUsuario,
              codigoDistribuidor:req.body.codigoDistribuidor,
              codigoBodega:req.body.codigoBodega  
            });
            const asignacionPercha = await models.asignacionPercha.create({
              numComprobante:req.body.numComprobante,
              descripcion:req.body.descripcion,
              detalles:req.body.detalles,
              codigoUsuario:req.body.codigoUsuario,
              codigoDistribuidor:req.body.codigoDistribuidor,
              codigoBodega:req.body.codigoBodega  
            });
            res.status(200).json("ok");
        } catch (e){
            res.status(500).send({
                message:'Ocurrió un error al intentar agregar compras.'+e
            });
            next(e);
        } 
    },
    query: async (req,res,next) => {
        try {
            const reg=await models.compras.findOne({_id:req.query._id}).populate([
                {path:'codigoBodega', model:'bodega'},
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
            const reg=await models.compras.find({$and:[{codigoDistribuidor:req.query.codigoDistribuidor}]}).populate([
                {path:'codigoBodega', model:'bodega'},
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
            const reg = await models.compras.findByIdAndUpdate({_id:req.body._id},{estado:1},function (err,data) {
                if(err) return err;
                if(data){
                    
                    let info={
                        numComprobante:data.numComprobante,
                        descripcion:data.descripcion,
                        detalles:data.detalles,
                        codigoUsuario:data.codigoUsuario,
                        codigoDistribuidor:data.codigoDistribuidor,
                        codigoBodega:data.codigoBodega  

                    }
                    const verificacionCrear = crear(info)
                    if (verificacionCrear) {
                        res.status(200).json("ok");
                    } else {
                        res.status(500).send({
                            message:'Ocurrió un error al intentar crear el registro de la cuarentena.'
                        }); 
                    }
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
