import models from '../models';

function paddy(num, padlen, padchar) {
    var pad_char = typeof padchar !== 'undefined' ? padchar : '0';
    var pad = new Array(1 + padlen).join(pad_char);
    return (pad + num).slice(-pad.length);
}
export default {
    add: async (req,res,next) =>{
        try {
            const reg = await models.cuentasporcobrar.create(req.body);
            res.status(200).json(reg);
        } catch (e){
            res.status(500).send({
                message:'Ocurrió un error al intentar agregar .cuentasporcobrar.'+e
            });
            next(e);
        } 
    },
    query: async (req,res,next) => {
        try {
            const reg=await models.cuentasporcobrar.findOne({_id:req.query._id})    
              .populate([
                {path:'codigoEgreso', model:'egreso'},
                {path:'codigoUsuario', model:'usuario'},
                {path:'codigoCliente', model:'cliente'},
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
                message:'Ocurrió un error al buscar el registro de .cuentasporcobrar.'
            });
            next(e);
        }
    },
    list: async (req,res,next) => {
        try {
            let valor=req.query.valor;
            const reg=await models.cuentasporcobrar.find({$and:[{codigoDistribuidor:req.query.codigoDistribuidor}]})
            .populate([
                {path:'codigoEgreso', model:'egreso'},
                {path:'codigoUsuario', model:'usuario'},
                {path:'codigoCliente', model:'cliente'},
                {path:'codigoDistribuidor', model:'distribuidor'},
                ])
            .sort({'descripcion':1});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar listar los .cuentasporcobrares.'
            });
            next(e);
        }
    },
    update: async (req,res,next) => {
        try {         
            const reg = await models.cuentasporcobrar.findByIdAndUpdate({_id:req.body._id},
                {descripcion:req.body.descripcion});
                    
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al actualizar el .cuentasporcobrar.'
            });
            next(e);
        }
    },
    remove: async (req,res,next) => {
        try {
            const reg = await models.cuentasporcobrar.findByIdAndDelete({_id:req.body._id});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar eliminar el .cuentasporcobrar.'
            });
            next(e);
        }
    },
    activate: async (req,res,next) => {
        try {
            const reg = await models.cuentasporcobrar.findByIdAndUpdate({_id:req.body._id},{estado:1});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar activar el .cuentasporcobrar.'
            });
            next(e);
        }
    },
    deactivate:async (req,res,next) => {
        try {
            const reg = await models.cuentasporcobrar.findByIdAndUpdate({_id:req.body._id},{estado:0});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar desactivar el .cuentasporcobrar.'
            });
            next(e);
        }
    },
    contarCuentas: async (req, res, next) => {
        try {
            const reg = await models.cuentasporcobrar.estimatedDocumentCount(function (err, count) {
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
            let codigoCliente = req.query.codigoCliente
            let numComprobante  = req.query.numComprobante
  
            let reg=[]
            if(numComprobante.length!==0){
  
              reg=await models.cuentasporcobrar
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
               {path:'codigoCliente', model:'cliente'},
               {path:'codigoDistribuidor', model:'distribuidor'},
                ])
                if(reg.length==0){
                    res.status(209).send({
                        message:'No hay datos para el filtro dado.'
                    });
                  }else{
                      res.status(200).json(reg);
                  }
            }else if (codigoCliente.length!==0) {
  
                reg=await models.cuentasporcobrar
                  .find(
                      {$and:[
                             { createdAt: { "$gte": req.query.finicio, "$lt": req.query.ffin }},
                             {codigoCliente:codigoCliente}
                            ]
                       }
                       )
               .populate([
                {path:'codigoCompra', model:'compras'},
                 {path:'codigoUsuario', model:'usuario'},
                 {path:'codigoCliente', model:'cliente'},
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
  
                    reg=await models.cuentasporcobrar
                      .find(
                          {$and:[
                                 { createdAt: { "$gte": req.query.finicio, "$lt": req.query.ffin }}
                                ]
                           }
                           )
                   .populate([
                    {path:'codigoCompra', model:'compras'},
                     {path:'codigoUsuario', model:'usuario'},
                     {path:'codigoCliente', model:'cliente'},
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
