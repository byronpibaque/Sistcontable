import models from '../models';

function paddy(num, padlen, padchar) {
    var pad_char = typeof padchar !== 'undefined' ? padchar : '0';
    var pad = new Array(1 + padlen).join(pad_char);
    return (pad + num).slice(-pad.length);
}
export default {
    add: async (req,res,next) =>{
        try {
            const reg = await models.cuentasporpagar.create(req.body);
            res.status(200).json(reg);
        } catch (e){
            res.status(500).send({
                message:'Ocurrió un error al intentar agregar .cuentasporpagar.'+e
            });
            next(e);
        } 
    },
    query: async (req,res,next) => {
        try {
            const reg=await models.cuentasporpagar.findOne({_id:req.query._id})    
              .populate([
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
                message:'Ocurrió un error al buscar el registro de .cuentasporpagar.'
            });
            next(e);
        }
    },
    list: async (req,res,next) => {
        try {
            let valor=req.query.valor;
            const reg=await models.cuentasporpagar.find({$and:[{codigoDistribuidor:req.query.codigoDistribuidor}]})
            .populate([
                {path:'codigoCompra', model:'compras'},
                {path:'codigoUsuario', model:'usuario'},
                {path:'codigoProveedor', model:'proveedor'},
                {path:'codigoDistribuidor', model:'distribuidor'},
                ])
            .sort({'descripcion':1});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar listar los .cuentasporpagares.'
            });
            next(e);
        }
    },
    update: async (req,res,next) => {
        try {         
            const reg = await models.cuentasporpagar.findByIdAndUpdate({_id:req.body._id},
                {descripcion:req.body.descripcion});
                    
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al actualizar el .cuentasporpagar.'
            });
            next(e);
        }
    },
    remove: async (req,res,next) => {
        try {
            const reg = await models.cuentasporpagar.findByIdAndDelete({_id:req.body._id});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar eliminar el .cuentasporpagar.'
            });
            next(e);
        }
    },
    activate: async (req,res,next) => {
        try {
            const reg = await models.cuentasporpagar.findByIdAndUpdate({_id:req.body._id},{estado:1});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar activar el .cuentasporpagar.'
            });
            next(e);
        }
    },
    deactivate:async (req,res,next) => {
        try {
            const reg = await models.cuentasporpagar.findByIdAndUpdate({_id:req.body._id},{estado:0});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar desactivar el .cuentasporpagar.'
            });
            next(e);
        }
    },
    contarCuentas: async (req, res, next) => {
        try {
            const reg = await models.cuentasporpagar.estimatedDocumentCount(function (err, count) {
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
    buscar:async(req, res,next)=>{
        try {
            let codigoProveedor = req.query.codigoProveedor
            let numComprobante  = req.query.numComprobante
  
            let reg=[]
            if(numComprobante.length!==0){
  
              reg=await models.cuentasporpagar
                .find(
                    {$and:[
                           { createdAt: { "$gte": req.query.finicio, "$lt": req.query.ffin }},
                           {numComprobanteFactura:numComprobante}
                          ]
                     }
                     )
             .populate([
               {path:'codigoCompra', model:'compras'},
               {path:'codigoUsuario', model:'usuario'},
               {path:'codigoProveedor', model:'proveedor'},
               {path:'codigoDistribuidor', model:'distribuidor'},
                ])
                if(reg.length==0){
                    res.status(209).send({
                        message:'No hay datos para el filtro dado.'
                    });
                  }else{
                      res.status(200).json(reg);
                  }
            }else if (codigoProveedor.length!==0) {
  
                reg=await models.cuentasporpagar
                  .find(
                      {$and:[
                             { createdAt: { "$gte": req.query.finicio, "$lt": req.query.ffin }},
                             {codigoProveedor:codigoProveedor}
                            ]
                       }
                       )
               .populate([
                {path:'codigoCompra', model:'compras'},
                 {path:'codigoUsuario', model:'usuario'},
                 {path:'codigoProveedor', model:'proveedor'},
                 {path:'codigoDistribuidor', model:'distribuidor'},
                  ])
                  if(reg.length==0){
                    res.status(209).send({
                        message:'No hay datos para el filtro dado.'
                    });
                  }else{
                      res.status(200).json(reg);
                  }
  
            } else {
  
                    reg=await models.cuentasporpagar
                      .find(
                          {$and:[
                                 { createdAt: { "$gte": req.query.finicio, "$lt": req.query.ffin }}
                                ]
                           }
                           )
                   .populate([
                    {path:'codigoCompra', model:'compras'},
                     {path:'codigoUsuario', model:'usuario'},
                     {path:'codigoProveedor', model:'proveedor'},
                     {path:'codigoDistribuidor', model:'distribuidor'},
                      ])
                      if(reg.length==0){
                        res.status(209).send({
                            message:'No hay datos para el filtro dado.'
                        });
                      }else{
                          res.status(200).json(reg);
                      }
            }
  
  
  
  
  
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al buscar el registro de inventario_esquema.'+e
            });
            next(e);
        }
      }
}
