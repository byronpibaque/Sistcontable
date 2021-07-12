import models from '../models';
export default {
    add: async (req,res,next) =>{
        try {
            const reg = await models.bodega_esquema.create(req.body);
            res.status(200).json(reg);
        } catch (e){
            res.status(500).send({
                message:'Ocurrió un error al intentar agregar bodega_esquema.'+e
            });
            next(e);
        } 
    },
    query: async (req,res,next) => {
        try {
            const reg=await models.bodega_esquema.findOne({codigoDistribuidor:req.query.codigoDistribuidor}) .populate([
                {path:'codigoDistribuidor', model:'distribuidor'},
                {path:'codigoUsuario', model:'usuario'},
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
                message:'Ocurrió un error al buscar el registro de bodega_esquema.'
            });
            next(e);
        }
    },
    list: async (req,res,next) => {
        try {
            let valor=req.query.valor;
            const reg=await models.bodega_esquema.find({$or:[{'descripcion':new RegExp(valor,'i')}]},{createdAt:0})
            .populate([
                {path:'codigoDistribuidor', model:'distribuidor'},
                {path:'codigoUsuario', model:'usuario'},
               
                ])
            .sort({'descripcion':1});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar listar los bodega_esquemaes.'
            });
            next(e);
        }
    },
    update: async (req,res,next) => {
        try {         
            const reg = await models.bodega_esquema.findByIdAndUpdate({_id:req.body._id},
                {
                    codigoNumerico:req.body.codigoNumerico,
                    descripcion:req.body.descripcion,
                    codigoDistribuidor:req.body.codigoDistribuidor,
                    codigoUsuario:req.body.codigoUsuario

                });
                    
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al actualizar el bodega_esquema.'
            });
            next(e);
        }
    },
    remove: async (req,res,next) => {
        try {
            const reg = await models.bodega_esquema.findByIdAndDelete({_id:req.query._id});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar eliminar el bodega_esquema.'
            });
            next(e);
        }
    },
    activate: async (req,res,next) => {
        try {
            const reg = await models.bodega_esquema.findByIdAndUpdate({_id:req.body._id},{estado:1});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar activar el bodega_esquema.'
            });
            next(e);
        }
    },
    deactivate:async (req,res,next) => {
        try {
            const reg = await models.bodega_esquema.findByIdAndUpdate({_id:req.body._id},{estado:0});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar desactivar el bodega_esquema.'
            });
            next(e);
        }
    }
}
