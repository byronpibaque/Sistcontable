import models from '../models';
export default {
    add: async (req,res,next) =>{
        try {
            const reg = await models.presentacion_esquema.create(req.body);
            res.status(200).json(reg);
        } catch (e){
            res.status(500).send({
                message:'Ocurrió un error al intentar agregar presentacion_esquema.'+e
            });
            next(e);
        } 
    },
    query: async (req,res,next) => {
        try {
            const reg=await models.presentacion_esquema.findOne({_id:req.query._id});
            if (!reg){
                res.status(404).send({
                    message: 'El registro no existe.'
                });
            } else{
                res.status(200).json(reg);
            }
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al buscar el registro de presentacion_esquema.'
            });
            next(e);
        }
    },
    list: async (req,res,next) => {
        try {
            let valor=req.query.valor;
            const reg=await models.presentacion_esquema.find({$or:[{'descripcion':new RegExp(valor,'i')}]},{createdAt:0})
            .sort({$natural: -1});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar listar los presentacion_esquemaes.'
            });
            next(e);
        }
    },
    update: async (req,res,next) => {
        try {         
            const reg = await models.presentacion_esquema.findByIdAndUpdate({_id:req.body._id},
                {descripcion:req.body.descripcion,
                codigoUsuario:req.query.codigoUsuario});
                    
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al actualizar el presentacion_esquema.'
            });
            next(e);
        }
    },
    remove: async (req,res,next) => {
        try {
            const reg = await models.presentacion_esquema.findByIdAndDelete({_id:req.query._id});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar eliminar el presentacion_esquema.'
            });
            next(e);
        }
    },
    activate: async (req,res,next) => {
        try {
            const reg = await models.presentacion_esquema.findByIdAndUpdate({_id:req.body._id},{estado:1});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar activar el presentacion_esquema.'
            });
            next(e);
        }
    },
    deactivate:async (req,res,next) => {
        try {
            const reg = await models.presentacion_esquema.findByIdAndUpdate({_id:req.body._id},{estado:0});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar desactivar el presentacion_esquema.'
            });
            next(e);
        }
    }
}
