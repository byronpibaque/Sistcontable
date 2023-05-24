import models from '../models';
var pdf = require('html-pdf');

export default {
    add: async (req,res,next) =>{
        try {
          let arrayDetalles = [];

          req.body.detalles.forEach( async (detalle) => {
            const diferenciasUnidades = parseInt( detalle.fraccionesTotales ) - parseInt( detalle.unidades )

            arrayDetalles.push({
              producto_id:  detalle._id,
              vidaUtil:     detalle.vidaUtil,
              unidades:     detalle.unidades,
              p_unitario:   detalle.p_unitario,
              p_total:      detalle.p_total
            })

            //Bajar Stock del inventario
            await models.inventario_esquema.updateOne(
              { _id: detalle._id },
              { fraccionesTotales: diferenciasUnidades }
            );

          })

          req.body.detalles = arrayDetalles;

          await models.Acta_Entrega.create( req.body );                

          res.json({ msg: 'Acta de entrega agregado exitosamente' });
        } catch (e){
            res.status(500).send({ 
                message:'Error al agregar temp y humed.' + e 
            });
            next(e);
        } 
    },
    getActaByID: async (req, res, next) => {
      try {
          const acta_entrega = await models.Acta_Entrega
            .find({ _id: req.params.acta_id })
            .populate([{path:'detalles.producto_id', model:'inventario'}])
          
          res.json({ acta_entrega })
      } catch (e){
          res.status(500).send({ message:'Error al obtener temp y humed.' + e });
          next(e);
      } 
    },
    detalleProducto: async (req, res, next) => {
      try {
          const producto = await models.producto_esquema
            .find({ _id: req.params.producto_id })
            .populate([{path:'codigoConcentracion', model:'concentracion'}])
            .populate([{path:'codigoPresentacion', model:'presentacion'}])
          
          res.json({ producto })
      } catch (e){
          res.status(500).send({ message:'Error al obtener temp y humed.' + e });
          next(e);
      } 
    },
    edit: async (req,res,next) =>{
        try {
            const { _id } = req.body;
            const response = await models.Temp_Humedad.findByIdAndUpdate( _id, req.body, { new: true });

            res.json({ response })
        } catch (e){
            res.status(500).send({ message:'Error al agregar temp y humed.' + e });
            next(e);
        } 
    },
    get: async (req,res,next) =>{
      try {
          const list = await models.Acta_Entrega.find().sort({$natural:-1});
          
          res.json({ list })
      } catch (e){
          res.status(500).send({ message:'Error al obtener temp y humed.' + e });
          next(e);
      } 
    },
    delete: async (req, res, next) =>{
        try {
          req.body.detalles.forEach( async (detalle) => {    
            models.inventario_esquema.find({ _id: detalle.producto_id }).then( async(data) => {
              let suma = data[0].fraccionesTotales + parseInt( detalle.unidades )

              //Aumentar Stock del inventario
              await models.inventario_esquema.updateOne(
                { _id: detalle.producto_id },
                { fraccionesTotales: suma }
              );
            });
          }) 
          
          await models.Acta_Entrega.updateOne(
            { _id: req.params.acta_id },
            { estado: 0 }
          );

          res.json({ msg: 'Acta de Entrega Cancelado' })
        } catch (e){
            res.status(500).send({ message:'Error al obtener temp y humed.' + e });
            next(e);
        } 
    }
}
