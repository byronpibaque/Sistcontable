import models from '../models';
export default {
    add: async (req,res,next) =>{
        try {
            const reg = await models.Distribuidor_esquema.create(req.body);
            res.status(200).json(reg);
        } catch (e){
            res.status(500).send({
                message:'Ocurrió un error al intentar agregar Distribuidor_esquema.'+e
            });
            next(e);
        } 
    },
    addEstablecimientos: async(req,res,next)=>{
        try {
           
            let clienteID=req.body._id
            let registroObject = req.body.establecimientos
            const updatedObject= await models.Distribuidor_esquema
            .update({_id:clienteID},
                {$addToSet:{"establecimientos":{$each:registroObject}}}
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
            const reg=await models.Distribuidor_esquema.findOne({_id:req.query._id});
            if (!reg){
                res.status(404).send({
                    message: 'El registro no existe.'
                });
            } else{
                res.status(200).json(reg);
            }
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al buscar el registro de Distribuidor_esquema.'
            });
            next(e);
        }
    },
    list: async (req,res,next) => {
        try {
            let valor=req.query.valor;
            const reg=await models.Distribuidor_esquema.find({})
            .sort({'razonSocial':1});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar listar los Distribuidor_esquemaes.'
            });
            next(e);
        }
    },
    updateEstablecimientos: async (req,res,next) => {
        try {         
            const reg = await models.Distribuidor_esquema
            .update(
                {
                    "establecimientos._id":req.body._id
                },
                {
                $set:{
                    "establecimientos.$.numEstablecimiento":req.body.numEstablecimiento,
                    "establecimientos.$.tipoEstablecimiento":req.body.tipoEstablecimiento,
                    "establecimientos.$.estadoEstablecimiento":req.body.estadoEstablecimiento,
                    "establecimientos.$.nombreComercialEstablecimiento":req.body.nombreComercialEstablecimiento,
                    "establecimientos.$.direccionEstablecimiento":req.body.direccionEstablecimiento
                }
            });
                res.status(200).json(reg);     
            
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al actualizar el Distribuidor_esquema.'+e
            });
            next(e);
        }
    },
    updatedatos: async (req,res,next) => {
        try {         
            const reg = await models.Distribuidor_esquema
            .findByIdAndUpdate({_id:req.body._id},
                {ruc:req.body.ruc,
                razonSocial:req.body.razonSocial,
                nombreComercial:req.body.nombreComercial,
                fechaInicioAct:req.body.fechaInicioAct,
                obligadoContabilidad:req.body.obligadoContabilidad,
                direccion:req.body.direccion,
                correo:req.body.correo,
                establecimientos:req.body.establecimientos
            }
                );
                    
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al actualizar el Distribuidor_esquema.'
            });
            next(e);
        }
    },
    remove: async (req,res,next) => {
        try {
            const reg = await models.Distribuidor_esquema.findByIdAndDelete({_id:req.query._id});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar eliminar el Distribuidor_esquema.'
            });
            next(e);
        }
    },
    removeEstablecimiento: async (req,res,next) => {
        try {
            const reg = await models.Distribuidor_esquema.update({_id:req.query._id},
                {$pull:{"establecimientos":{ "_id":req.query.codigoEstablecimiento}}
            })
            res.status(200).send({
                message:'Eliminado!'
            });
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar eliminar el Distribuidor_esquema.'+e
            });
            next(e);
        }
    },
    activate: async (req,res,next) => {
        try {
            const reg = await models.Distribuidor_esquema.findByIdAndUpdate({_id:req.body._id},{estado:1});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar activar el Distribuidor_esquema.'
            });
            next(e);
        }
    },
    deactivate:async (req,res,next) => {
        try {
            const reg = await models.Distribuidor_esquema.findByIdAndUpdate({_id:req.body._id},{estado:0});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar desactivar el Distribuidor_esquema.'
            });
            next(e);
        }
    }
}
