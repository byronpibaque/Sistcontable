import models from '../models';
export default {
    add: async (req,res,next) =>{
        try {
            const reg = await models.inventario_esquema.create(req.body);
            res.status(200).json(reg);
        } catch (e){
            res.status(500).send({
                message:'Ocurrió un error al intentar agregar inventario_esquema.'+e
            });
            next(e);
        } 
    },
    buscarCodigo: async (req,res,next) => {
        try {
            let producto = req.query.data
            const reg=await models.inventario_esquema
            .findOne(
                {$and:[{"codigoBodega":req.query.codigoBodega},
                {$or:[
                    {'codigoBarra':producto},
                    {"codigoLote":producto},
                    {'codigoProducto.descripcion': new RegExp('^'+producto,'i')},
                    {'codigoProducto.descripcion':  new RegExp(producto+'$','i')},
                    {'codigoProducto.descripcion':new RegExp(producto,'i')},
                    {'nombreComercial':new RegExp(producto,'i')},
                    {'nombreComercial': new RegExp('^'+producto,'i')},
                    {'nombreComercial':  new RegExp(producto+'$','i')},    
                ]}]})
         .populate([
            {path:'codigoBodega', model:'bodega'},
            {path:'codigoFabricante', model:'fabricante'},
            {path:'codigoProveedor', model:'proveedor'},
            {path:'codigoUsuario', model:'usuario'},
            {path:'codigoProducto', model:'producto'},
            ])
            if (!reg){
                res.status(206).send({
                    message: 'No se han encontrados registros para el valor:'+req.query.data
                });
            } else{
                res.status(200).json(reg);
            }
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al buscar el registro de inventario_esquema.'+e
            });
            next(e);
        }
    },
    buscar: async (req,res,next) => {
        try {
            let producto = req.query.data
            const reg=await models.inventario_esquema
            .find(
            {$and:[{"codigoBodega":req.query.codigoBodega},
            {$or:[
                {'codigoBarra':producto},
                {'codigoLote':producto},
                {'codigoProducto.descripcion': new RegExp('^'+producto,'i')},
                {'codigoProducto.descripcion':  new RegExp(producto+'$','i')},
                {'codigoProducto.descripcion':new RegExp(producto,'i')},
                {'nombreComercial':new RegExp(producto,'i')},
                {'nombreComercial': new RegExp('^'+producto,'i')},
                {'nombreComercial':  new RegExp(producto+'$','i')},    
            ]}]})
            .populate([
            {path:'codigoBodega', model:'bodega'},
            {path:'codigoFabricante', model:'fabricante'},
            {path:'codigoProveedor', model:'proveedor'},
            {path:'codigoUsuario', model:'usuario'},
            {path:'codigoProducto', model:'producto'},
            ]).sort({'nombreComercial':1});
          
            if (!reg || reg.length==0){
                res.status(206).send({
                    message: 'No se han encontrados registros para el valor:'+req.query.data
                });
            } else{
                res.status(200).json(reg);
            }
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al buscar el registro de inventario_esquema.'+e
            });
            next(e);
        }
    },
    query: async (req,res,next) => {
        try {
            const reg=await models.inventario_esquema.findOne({_id:req.query._id});
            if (!reg){
                res.status(404).send({
                    message: 'El registro no existe.'
                });
            } else{
                res.status(200).json(reg);
            }
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al buscar el registro de inventario_esquema.'
            });
            next(e);
        }
    },
    queryVerificarLote: async (req,res,next) => {
        try {
            const reg=await models.inventario_esquema.findOne({$and:[{"codigoBodega":req.query.codigoBodega}
            ,{"codigoLote":req.query.codigoLote}]});
            if (!reg){
                res.status(206).send({
                    message: 'El registro no existe.'
                });
            } else{
                res.status(200).send({
                    message: 'Existe un registro con mismo lote.'
                });
            }
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al buscar el registro de inventario_esquema.'
            });
            next(e);
        }
    },
    list: async (req,res,next) => {
        try {
            const reg=await models.inventario_esquema.find({codigoBodega:req.query.codigoBodega})  
            .populate([
                { path: 'codigoBodega',     model: 'bodega' },
                { path: 'codigoFabricante', model: 'fabricante' },
                { path: 'codigoProveedor',  model: 'proveedor' },
                { path: 'codigoUsuario',    model: 'usuario' },
                { path: 'codigoProducto',   model: 'producto' },
            ]).sort({ $natural: -1 });

            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar listar los inventario_esquemaes.'
            });
            next(e);
        }
    },
    update: async (req,res,next) => {
        try {         
            const reg = await models.inventario_esquema.findByIdAndUpdate({_id:req.body._id},
                {
                codigoBarra:req.body.codigoBarra,
                codigoLote:req.body.codigoLote,
                nombreComercial:req.body.nombreComercial,
                registroSanitario:req.body.registroSanitario,
                fraccionesTotales:req.body.fraccionesTotales,
                fechaCaducidad:req.body.fechaCaducidad,
                fechaElaboracion:req.body.fechaElaboracion,
                iva:req.body.iva,
                descuento:req.body.descuento,
                pvp:req.body.pvp,
                pvm:req.body.pvm,
                punit:req.body.punit,
                costoNeto:req.body.costoNeto,
                codigoUsuario:req.body.codigoUsuario,
                codigoBodega :req.body.codigoBodega, 
                codigoFabricante :req.body.codigoFabricante,
                codigoProveedor :req.body.codigoProveedor,  
                codigoProducto :req.body.codigoProducto 
            });
                    
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al actualizar el inventario_esquema.'
            });
            next(e);
        }
    },
    remove: async (req,res,next) => {
        try {
            const reg = await models.inventario_esquema.findByIdAndDelete({_id:req.query._id});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar eliminar el inventario_esquema.'
            });
            next(e);
        }
    },
    activate: async (req,res,next) => {
        try {
            const reg = await models.inventario_esquema.findByIdAndUpdate({_id:req.body._id},{estado:1});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar activar el inventario_esquema.'
            });
            next(e);
        }
    },
    deactivate:async (req,res,next) => {
        try {
            const reg = await models.inventario_esquema.findByIdAndUpdate({_id:req.body._id},{estado:0});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar desactivar el inventario_esquema.'
            });
            next(e);
        }
    }
}
