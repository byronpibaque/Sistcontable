import models from "../models";

export default {
  add: async (req, res, next) => {
    try {
      const reg = await models.perchas.create(req.body);
      
      res.status(200).json("ok");
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error al intentar agregar perchas." + e,
      });
      next(e);
    }
  },
  addEstablecimientos: async(req,res,next)=>{
    try {
       
        let _id=req.body._id
        let registroObject = req.body.niveles
        const updatedObject= await models.perchas
        .update({_id:_id},
            {$addToSet:{"niveles":{$each:registroObject}}}
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
  query: async (req, res, next) => {
    try {
      const reg = await models.perchas.findOne({ _id: req.query._id }).populate([
        {path:'codigoBodega', model:'bodega'},
        {path:'codigoUsuario', model:'usuario'},
        ])
      if (!reg) {
        res.status(404).send({
          message: "El registro no existe.",
        });
      } else {
        res.status(200).json(reg);
      }
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error al buscar el registro de perchas.",
      });
      next(e);
    }
  },
  list: async (req, res, next) => {
    try {
      let valor = req.query.valor;
      const reg = await models.perchas
        .find(
          { $or: [{ descripcion: new RegExp(valor, "i") }] },
          { createdAt: 0 }
        ).populate([
            {path:'codigoBodega', model:'bodega'},
            {path:'codigoUsuario', model:'usuario'},
            ])
        .sort({ descripcion: 1 });
      res.status(200).json(reg);
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error al intentar listar los perchases.",
      });
      next(e);
    }
  },
  update: async (req, res, next) => {
    try {
      const reg = await models.perchas.findByIdAndUpdate(
        { _id: req.body._id },
        {
            descripcion:req.body.descripcion,
            niveles:req.body.niveles
        }
      );

      res.status(200).json(reg);
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error al actualizar el perchas.",
      });
      next(e);
    }
  },
  remove: async (req, res, next) => {
    try {
      const reg = await models.perchas.findByIdAndDelete(
        { _id: req.query._id },
        function (err, data) {
          if (err) return err;
          if (data) {
           
              res.status(200).json("ok");
            } else {
              res.status(500).send({
                message:
                  "Ocurrió un error al intentar eliminar el registro de la cuarentena.",
              });
            }
          
        }
      );
      // res.status(200).json(reg);
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error al intentar eliminar el perchas.",
      });
      next(e);
    }
  },
  activate: async (req, res, next) => {
    try {
      const reg = await models.perchas.findByIdAndUpdate(
        { _id: req.body._id },
        { estado: 1 },
        function (err, data) {
          if (err) return err;
          if (data) {
            res.status(200).json("ok");
          } else {
            res.status(500).send({
              message:
                "Ocurrió un error al intentar crear el registro de la cuarentena.",
            });
          }
        }
      );
      // res.status(200).json(reg);
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error al intentar activar el perchas.",
      });
      next(e);
    }
  },
  deactivate: async (req, res, next) => {
    try {
      const reg = await models.perchas.findByIdAndUpdate(
        { _id: req.body._id },
        { estado: 0 },
        function (err, data) {
          if (err) return err;
          if (data) {
            res.status(200).json("ok");
          } else {
            res.status(500).send({
              message:
                "Ocurrió un error al intentar desactivar el registro de la cuarentena.",
            });
          }
        }
      );
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error al intentar desactivar el perchas.",
      });
      next(e);
    }
  },
};
