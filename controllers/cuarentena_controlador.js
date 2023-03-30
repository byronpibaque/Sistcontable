import models from "../models";
export default {
  add: async (req, res, next) => {
    try {
      const reg = await models.cuarentenas.create(req.body);
      res.status(200).json(reg);
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error al intentar agregar cuarentenas." + e,
      });
      next(e);
    }
  },
  query: async (req,res,next) => {
    try {
        const reg=await models.cuarentenas.findOne({_id:req.query._id}).populate([
            {path:'codigoBodega', model:'bodega'},
            {path:'codigoUsuario', model:'usuario'},
            // {path:'codigoProveedor', model:'proveedor'},
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
            message:'Ocurrió un error al buscar el registro de compras.'
        });
        next(e);
    }
},
  list: async (req, res, next) => {
    try {
      let valor = req.query.valor;
      const reg = await models.cuarentenas
        .find({
          $and:[{ codigoDistribuidor: req.query.codigoDistribuidor }]
        })
        .populate([
          {path:'codigoBodega', model:'bodega'},
          {path:'codigoUsuario', model:'usuario'},
          {path:'codigoProveedor', model:'proveedor'},
          {path:'codigoDistribuidor', model:'distribuidor'},
        ])
        .sort({$natural:-1});
      res.status(200).json(reg);
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error al intentar listar los cuarentenases.",
      });
      next(e);
    }
  },
  update: async (req, res, next) => {
    try {
      const reg = await models.cuarentenas.findByIdAndUpdate(
        { _id: req.body._id },
        {
          // codigoNumerico:req.body.codigoNumerico,
          // descripcion:req.body.descripcion,
          // codigoDistribuidor:req.body.codigoDistribuidor,
          // codigoUsuario:req.body.codigoUsuario
        }
      );

      res.status(200).json(reg);
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error al actualizar el cuarentenas.",
      });
      next(e);
    }
  },
  remove: async (req, res, next) => {
    try {
      const reg = await models.cuarentenas.findByIdAndDelete({
        _id: req.query._id,
      });
      res.status(200).json(reg);
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error al intentar eliminar el cuarentenas.",
      });
      next(e);
    }
  },
  activar_detalle: async (req, res, next) => {
    try {
      const reg = await models.cuarentenas.update(
        { "detalles._id": req.body._id, "_id": req.body.cuarentena_id }, 
        {
          $set: {
            "detalles.$.estado": 1,
            "detalles.$.descripcion": ""
          }        
        }, async function (err, data) {
          if (err) return err;
          if (data) {
            await models.asignacionPercha.update(
            { "detalles._id": req.body._id, "numComprobante": req.body.numComprobante },{
              $set: {
                "detalles.$.estado": 1,
                "detalles.$.descripcion": ""
              },
            }, async function (err, data) {
              if (err) return err;
              if (data) res.status(200).json(reg);                
            });
          }
        });
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error al actualizar el detalle de cuarentena." + e,
      });
      next(e);
    }
  },
  desactivar_detalle: async (req, res, next) => {
    try {
      const reg = await models.cuarentenas.update({ 
        "detalles._id": req.body._id, 
        "_id": req.body.cuarentena_id 
      },{ $set: {
            "detalles.$.estado": 0,
            "detalles.$.descripcion": req.body.descripcion
        }}, async function (err,data) {
            if(err) return err;
            if(data){
              await models.asignacionPercha.update({
                "detalles._id": req.body._id,
                "numComprobante": req.body.numComprobante
              },{ $set: {
                  "detalles.$.estado": 0,
                  "detalles.$.descripcion": req.body.descripcion,
                } 
              }, async function (err,data) {
                  if(err) return err;
                  if(data) res.status(200).json(reg); 
              })
            }
        })
    } catch (e) {
      res.status(500).send({ message: "Ocurrió un error al actualizar el detalle de cuarentena." + e });
      next(e);
    }
  },
  activate: async (req, res, next) => {
    try {
      const reg = await models.cuarentenas.findByIdAndUpdate(
        { _id: req.body._id },
        { estado: 1 }
      );
      res.status(200).json(reg);
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error al intentar activar el cuarentenas.",
      });
      next(e);
    }
  },
  deactivate: async (req, res, next) => {
    try {
      const reg = await models.cuarentenas.findByIdAndUpdate(
        { _id: req.body._id },
        { estado: 0 }
      );
      res.status(200).json(reg);
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error al intentar desactivar el cuarentenas.",
      });
      next(e);
    }
  },
};
