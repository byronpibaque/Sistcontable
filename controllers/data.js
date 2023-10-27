import models from '../models';
function paddy(num, padlen, padchar) {
    var pad_char = typeof padchar !== 'undefined' ? padchar : '0';
    var pad = new Array(1 + padlen).join(pad_char);
    return (pad + num).slice(-pad.length);
}
export default {
    add: async (req,res,next) =>{
        try {
            const reg = await models.data_esquema.create(req.body);
            res.status(200).json(reg);
        } catch (e){
            res.status(500).send({
                message:'Ocurrió un error al intentar agregar data_esquema.'+e
            });
            next(e);
        }
    },
    queryxid: async (req,res,next) => {
        try {
            const reg=await models.data_esquema
            .findOne({"_id":req.query._id})
            .populate([
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
                message:'Ocurrió un error al buscar el registro de data_esquema.'
            });
            next(e);
        }
    },
    query: async (req,res,next) => {
        try {
            const reg=await models.data_esquema
            .find({$and:[
              {"codigoUsuario":req.query.codigoUsuario},
            {"codigoDistribuidor":req.query.codigoDistribuidor}
          ]})
            .populate([
                {path:'codigoDistribuidor', model:'distribuidor'},
                {path:'codigoUsuario', model:'usuario'},
                ])

            if (!reg){
                res.status(404).send({
                    message: 'El registro no existe.'
                });
            } else{
                for (let index = 0; index < reg.length; index++) {
                    const element = reg[index];

                    element.secuenciales.forEach(x => {
                        if (x.documento==req.query.documento) {
                            let secuencia = paddy(parseInt(x.secuencial),9)
                            let ptoEmision = paddy(parseInt(element.ptoEmision),3)
                                let data = {
                                    _id:element._id,
                                    secuencial:secuencia,
                                    ptoEmision:ptoEmision
                                }
                              //  console.log(data);
                                res.status(200).json(data);
                        }
                    });
                }


            }
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al buscar el registro de data_esquema.'+e
            });
            next(e);
        }
    },
    list: async (req,res,next) => {
        try {
            let valor=req.query.valor;
            const reg=await models.data_esquema.find()
            .populate([
                {path:'codigoDistribuidor', model:'distribuidor'},
                {path:'codigoUsuario', model:'usuario'},
                ])
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar listar los data_esquemaes.'
            });
            next(e);
        }
    },
    update: async (req,res,next) => {
        try {
            const reg = await models.data_esquema.findByIdAndUpdate({_id:req.body._id},
            {
                secuenciales:req.body.secuenciales,
                ptoEmision:req.body.ptoEmision,
                codigoDistribuidor:req.body.codigoDistribuidor,
                codigoUsuario:req.body.codigoUsuario
            });

            res.status(200).json("ok");
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al actualizar el data_esquema.'
            });
            next(e);
        }
    },
    updateSecuencial: async (req,res,next) => {
        try {
            const data = await models.data_esquema.findOne({_id:req.body._id})
            let val=0
            data.secuenciales.forEach(element => {
                if (element.documento == req.body.documento) {
                  
                    models.data_esquema.update(
                        {"secuenciales._id":element._id},
                        {$set:{"secuenciales.$.secuencial":parseInt(req.body.numero)}
                    }, function (err,dat) {
                       if(err) return res.status(500).send({
                        message:'Ocurrió un error al actualizar el data_esquema.'+err
                    });
                       if(dat){
                            res.status(200).json("ok");
                       }
                   });
                }
            });




        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al actualizar el data_esquema.'+e
            });
            next(e);
        }
    },
    contarFacturas: async (req,res,next) => {
        try{
            const secuenciales = await models.data_esquema.find({$and:[
                {"codigoUsuario": req.query.codigoUsuario},
                {"codigoDistribuidor": req.query.codigoDistribuidor}
            ]});

            let secuencial = secuenciales[0].secuenciales.find( s => 
                    s.documento == 'FACTURA' )

            secuencial = paddy(parseInt( secuencial.secuencial+1 ),9)

            // const fact = await models.facturacion.find({$and:[
            //     {"codigoUsuario":req.query.codigoUsuario},
            //     {"codigoDistribuidor":req.query.codigoDistribuidor},
            //     {"estado":1}
            // ]}).count();
            // let secuencia = paddy(parseInt(fact+100),9)
            // console.log( secuencia );
            res.status(200).json( secuencial );
        } catch(e){
            res.status(500).send({ message:'Ocurrió un error al actualizar el data_esquema.' + e });
            next(e);
        }
    },
    remove: async (req,res,next) => {
        try {
            const reg = await models.data_esquema.findByIdAndDelete({_id:req.query._id});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar eliminar el data_esquema.'
            });
            next(e);
        }
    },
    activate: async (req,res,next) => {
        try {
            const reg = await models.data_esquema.findByIdAndUpdate({_id:req.body._id},{estado:1});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar activar el data_esquema.'
            });
            next(e);
        }
    },
    deactivate:async (req,res,next) => {
        try {
            const reg = await models.data_esquema.findByIdAndUpdate({_id:req.body._id},{estado:0});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar desactivar el data_esquema.'
            });
            next(e);
        }
    }
}
