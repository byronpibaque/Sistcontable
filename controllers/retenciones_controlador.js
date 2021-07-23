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
export default {
    add: async (req,res,next) =>{
        try {
            const reg = await models.retenciones.create(req.body);
            let totalValRet=0
            req.body.impuestos.forEach(x => {
                totalValRet=totalValRet+parseFloat(x.valorRetenido)
            });
            const fx  = agregarTotalRetenido(req.body.codigoCompra,totalValRet)
            fx.then((result) => {
                res.status(200).json("ok");   
            }).catch((err) => {
                res.status(500).send({
                    message:'Ocurrió un error al intentar actualizar la compra.'+err
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
            const reg = await models.retenciones.findByIdAndUpdate({_id:req.body._id},{estado:1});
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
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar desactivar el Rol_esquema.'
            });
            next(e);
        }
    }
}
