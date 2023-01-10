import models from '../models';
export default {
    add: async (req,res,next) =>{
        try {
            const reg = await models.fabricante_esquema.create(req.body);
            res.status(200).json(reg);
        } catch (e){
            res.status(500).send({
                message:'Ocurrió un error al intentar agregar fabricante_esquema.'+e
            });
            next(e);
        } 
    },
    addEstablecimientos: async(req,res,next)=>{
        try {
           
            let clienteID=req.body._id
            let registroObject = req.body.establecimientos
            const updatedObject= await models.fabricante_esquema
            .update({_id:clienteID},
                {$addToSet:{"contacto":{$each:registroObject}}}
            );
            res.status(200).send({
                message:'CORRECTO!'
            });
             
        } catch (e) {
            res.status(500).send({
                message:'Ocurrió un error.'+e
            });
            next(e); 
        }
    },
    query: async (req,res,next) => {
        try {
            const reg=await models.fabricante_esquema.findOne({_id:req.query._id}).populate([
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
                message:'Ocurrió un error al buscar el registro de fabricante_esquema.'
            });
            next(e);
        }
    },
    list: async (req,res,next) => {
        try {
            let valor=req.query.valor;
            const reg=await models.fabricante_esquema.find({}).populate([
                {path:'codigoDistribuidor', model:'distribuidor'},
                {path:'codigoUsuario', model:'usuario'},
                ])
            .sort({'razonsocial':1});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar listar los fabricante_esquemaes.'
            });
            next(e);
        }
    },
    updateEstablecimientos: async (req,res,next) => {
        try {         
            const reg = await models.fabricante_esquema
            .update(
                {
                    "contacto._id":req.body._id
                },
                {
                $set:{
                    "contacto.$.nombres":req.body.nombres,
                    "contacto.$.telefono":req.body.telefono,
                    "contacto.$.correo":req.body.correo,
             
                }
            });
                res.status(200).json(reg);     
            
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al actualizar el fabricante_esquema.'+e
            });
            next(e);
        }
    },
    updatedatos: async (req,res,next) => {
        try {         
            const reg = await models.fabricante_esquema
            .findByIdAndUpdate({_id:req.body._id},
                {ruc:req.body.ruc,
                razonsocial:req.body.razonsocial,
                direccion:req.body.direccion,
                codigoUsuario:req.body.codigoUsuario,
                contacto:req.body.contacto
            }
               
                );
                    
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al actualizar el fabricante_esquema.'
            });
            next(e);
        }
    },
    remove: async (req,res,next) => {
        try {
            const reg = await models.fabricante_esquema.findByIdAndDelete({_id:req.query._id});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar eliminar el fabricante_esquema.'
            });
            next(e);
        }
    },
    removeEstablecimiento: async (req,res,next) => {
        try {
            const reg = await models.fabricante_esquema.update({_id:req.body._id},
                {$pull:{"contacto":{ "_id":req.body.codigoContacto}}
            })
            res.status(200).send({
                message:'Eliminado!'
            });
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar eliminar el fabricante_esquema.'+e
            });
            next(e);
        }
    },
    activate: async (req,res,next) => {
        try {
            const reg = await models.fabricante_esquema.findByIdAndUpdate({_id:req.body._id},{estado:1});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar activar el fabricante_esquema.'
            });
            next(e);
        }
    },
    deactivate:async (req,res,next) => {
        try {
            const reg = await models.fabricante_esquema.findByIdAndUpdate({_id:req.body._id},{estado:0});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar desactivar el fabricante_esquema.'
            });
            next(e);
        }
    }
}
