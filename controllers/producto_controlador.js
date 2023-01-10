import models from '../models';
export default {
    add: async (req,res,next) =>{
        try {
            const reg = await models.producto_esquema.create(req.body);
            res.status(200).json(reg);
        } catch (e){
            res.status(500).send({
                message:'Ocurrió un error al intentar agregar producto_esquema.'+e
            });
            next(e);
        } 
    },
    query: async (req,res,next) => {
        try {
            const reg=await models.producto_esquema.findOne({_id:req.query._id})
            .populate([
                {path:'codigoTipoproducto', model:'tipoProducto'},
                {path:'codigoConcentracion', model:'concentracion'},
                {path:'codigoPresentacion', model:'presentacion'},
                {path:'codigoUsuario', model:'usuario'},
                {path:'codigoPrincipioactivo', model:'principioActivo'},
                ]);
            if (!reg){
                res.status(404).send({
                    message: 'El registro no existe.'
                });
            } else{
                res.status(200).json(reg);
            }
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al buscar el registro de producto_esquema.'
            });
            next(e);
        }
    },
    list: async (req,res,next) => {
        try {
            let valor=req.query.valor;
            const reg=await models.producto_esquema.find({$or:[{'descripcion':new RegExp(valor,'i')}]},{createdAt:0})
            .populate([
                {path:'codigoTipoproducto', model:'tipoProducto'},
                {path:'codigoConcentracion', model:'concentracion'},
                {path:'codigoPresentacion', model:'presentacion'},
                {path:'codigoUsuario', model:'usuario'},
                {path:'codigoPrincipioactivo', model:'principioActivo'},
                ])
            .sort({'descripcion':1});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar listar los producto_esquemaes.'
            });
            next(e);
        }
    },
    update: async (req,res,next) => {
        try {         
            const reg = await models.producto_esquema.findByIdAndUpdate({_id:req.body._id},
                {
                    descripcion:req.body.descripcion,
                    fraccionCaja:req.body.fraccionCaja,
                    contenidoNeto:req.body.contenidoNeto,
                    detalleConcentracion:req.body.detalleConcentracion,
                    codigoUsuario:req.body.codigoUsuario,
                    codigoTipoproducto:req.body.codigoTipoproducto,
                    codigoPrincipioactivo:req.body.codigoPrincipioactivo,
                    codigoPresentacion:req.body.codigoPresentacion,
                    codigoConcentracion:req.body.codigoConcentracion,
                    
                });
                    
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al actualizar el producto_esquema.'
            });
            next(e);
        }
    },
    remove: async (req,res,next) => {
        try {
            const reg = await models.producto_esquema.findByIdAndDelete({_id:req.query._id});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar eliminar el producto_esquema.'
            });
            next(e);
        }
    },
    activate: async (req,res,next) => {
        try {
            const reg = await models.producto_esquema.findByIdAndUpdate({_id:req.body._id},{estado:1});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar activar el producto_esquema.'
            });
            next(e);
        }
    },
    deactivate:async (req,res,next) => {
        try {
            const reg = await models.producto_esquema.findByIdAndUpdate({_id:req.body._id},{estado:0});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar desactivar el producto_esquema.'
            });
            next(e);
        }
    }
}
