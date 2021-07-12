import models from '../models';
export default {
    add: async (req,res,next) =>{
        try {
            const reg = await models.proveedor_esquema.create(req.body);
            res.status(200).json(reg);
        } catch (e){
            res.status(500).send({
                message:'Ocurrió un error al intentar agregar proveedor_esquema.'+e
            });
            next(e);
        } 
    },
    addEstablecimientos: async(req,res,next)=>{
        try {
           
            let clienteID=req.body._id
            let registroObject = req.body.establecimientos
            const updatedObject= await models.proveedor_esquema
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
    buscarProveedor: async (req,res,next) => {
        try {
            models.proveedor_esquema
            .findOne({$or:[{"ruc":req.query.data},
            // {"nombres":req.query.data},
            {'razonsocial': new RegExp('^'+req.query.data,'i')},
            {'razonsocial':  new RegExp(req.query.data+'$','i')},
            {'razonsocial': new RegExp('^'+req.query.data,'i')},
            {'razonsocial':  new RegExp(req.query.data+'$','i')},
        ]})
            .exec(function (err,persona) {
                    if(err)  
                    return res.status(500).send({
                                    message:'Ocurrió un error: '+err
                                 });
                                 
                    if(!persona){
                        res.status(206).send({message:"No existe ningun registro para:"+req.query.data})
                    }else{
                        res.status(200).send(persona); 
                    }
                     
                  
                    
                }) 
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    query: async (req,res,next) => {
        try {
            const reg=await models.proveedor_esquema.findOne({_id:req.query._id}).populate([
              
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
                message:'Ocurrió un error al buscar el registro de proveedor_esquema.'
            });
            next(e);
        }
    },
    list: async (req,res,next) => {
        try {
            let valor=req.query.valor;
            const reg=await models.proveedor_esquema.find({}).populate([
                {path:'codigoDistribuidor', model:'distribuidor'},
                {path:'codigoUsuario', model:'usuario'},
                ])
            .sort({'razonsocial':1});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar listar los proveedor_esquemaes.'
            });
            next(e);
        }
    },
    updateEstablecimientos: async (req,res,next) => {
        try {         
            const reg = await models.proveedor_esquema
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
                message:'Ocurrió un error al actualizar el proveedor_esquema.'+e
            });
            next(e);
        }
    },
    updatedatos: async (req,res,next) => {
        try {         
            const reg = await models.proveedor_esquema
            .findByIdAndUpdate({_id:req.body._id},
                {ruc:req.body.ruc,
                razonsocial:req.body.razonsocial,
                direccion:req.body.direccion,
                codigoUsuario:req.body.codigoUsuario,
                contacto:req.body.contacto}
                );
                    
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al actualizar el proveedor_esquema.'
            });
            next(e);
        }
    },
    remove: async (req,res,next) => {
        try {
            const reg = await models.proveedor_esquema.findByIdAndDelete({_id:req.query._id});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar eliminar el proveedor_esquema.'
            });
            next(e);
        }
    },
    removeEstablecimiento: async (req,res,next) => {
        try {
            const reg = await models.proveedor_esquema.update({_id:req.body._id},
                {$pull:{"contacto":{ "_id":req.body.codigoContacto}}
            })
            res.status(200).send({
                message:'Eliminado!'
            });
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar eliminar el proveedor_esquema.'+e
            });
            next(e);
        }
    },
    activate: async (req,res,next) => {
        try {
            const reg = await models.proveedor_esquema.findByIdAndUpdate({_id:req.body._id},{estado:1});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar activar el proveedor_esquema.'
            });
            next(e);
        }
    },
    deactivate:async (req,res,next) => {
        try {
            const reg = await models.proveedor_esquema.findByIdAndUpdate({_id:req.body._id},{estado:0});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar desactivar el proveedor_esquema.'
            });
            next(e);
        }
    }
}
