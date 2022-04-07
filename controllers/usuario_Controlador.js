import bcryptjs from "bcryptjs";
import moment from "moment";
import models from "../models";
import token from "../services/token";

export default {
  add: async (req, res, next) => {
    try {
      const reg = await models.Usuario_esquema.create(req.body);
      res.status(200).json(reg);
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error" + e,
      });
      next(e);
    }
  },
  addAccesos: async (req, res, next) => {
    try {
      let clienteID = req.body._id;
      let registroObject = req.body.login;
      const updatedObject = await models.Usuario_esquema.update(
        { _id: clienteID },
        { $addToSet: { login: { $each: registroObject } } }
      );
      res.status(200).send({
        message: "CORRECTO!",
      });
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error." + e,
      });
      next(e);
    }
  },
  query: async (req, res, next) => {
    try {
      models.Usuario_esquema.findOne({ _id: req.query._id })
        .populate([
          { path: "codigoRol", model: "rol" },
          { path: "codigoGenero", model: "genero" },
          { path: "login.codigoDistribuidor", model: "distribuidor" },
        ])
        .exec(function (err, usuario) {
          if (err)
            return res.status(500).send({
              message: "Ocurrió un error: " + err,
            });
          if (usuario) {
            res.status(200).send(usuario);
          }
        });
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(e);
    }
  },
  list: async (req, res, next) => {
    try {
      let valor = req.query.valor;
      models.Usuario_esquema.find({ nombres: new RegExp(valor, "i") })
        .populate([
          { path: "codigoRol", model: "rol" },
          { path: "codigoGenero", model: "genero" },
          { path: "login.codigoDistribuidor", model: "distribuidor" },
        ])
        .exec(function (err, usuario) {
          if (err)
            throw res.status(500).send({
              message: "Ocurrió un error: " + err,
            });
          if (usuario) {
            res.status(200).send(usuario);
          }
        });
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(e);
    }
  },

  updateDatosPersonales: async (req, res, next) => {
    try {
      const reg = await models.Usuario_esquema.findByIdAndUpdate(
        { _id: req.body._id },
        {
          numDocumento: req.body.numDocumento,
          nombres: req.body.nombres,
          direccion: req.body.direccion,
          telefono: req.body.telefono,
          fechaNacimiento: req.body.fechaNacimiento,
          correo: req.body.correo,
          rol: req.body.rol,
          login: req.body.login,
        }
      );
      res.status(200).json(reg);
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(e);
    }
  },
  remove: async (req, res, next) => {
    try {
      const reg = await models.Usuario_esquema.findByIdAndDelete({
        _id: req.query._id,
      });
      res.status(200).json(reg);
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(e);
    }
  },
  removeEstablecimiento: async (req, res, next) => {
    try {
      const reg = await models.Usuario_esquema.update(
        { _id: req.query._id },
        { $pull: { login: { _id: req.query.codigoEstablecimiento } } }
      );
      res.status(200).send({
        message: "Eliminado!",
      });
    } catch (e) {
      res.status(500).send({
        message:
          "Ocurrió un error al intentar eliminar el fabricante_esquema." + e,
      });
      next(e);
    }
  },
  activate: async (req, res, next) => {
    try {
      const reg = await models.Usuario_esquema.findByIdAndUpdate(
        { _id: req.body._id },
        { estado: 1 }
      );
      res.status(200).json(reg);
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(e);
    }
  },
  deactivate: async (req, res, next) => {
    try {
      const reg = await models.Usuario_esquema.findByIdAndUpdate(
        { _id: req.body._id },
        { estado: 0 }
      );
      res.status(200).json(reg);
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(e);
    }
  },
  login: async (req, res, next) => {
    try {
      let codigoDistribuidor = "";
      let match = "";
      let user = await models.Usuario_esquema.findOne({
        $or: [{ "login.usuario": req.query.data }, { correo: req.query.data }],
      });
      if (user) {
        user.login.forEach(async (x) => {
          
          if (req.query.codigoDistribuidor == x.codigoDistribuidor) {
            codigoDistribuidor = x.codigoDistribuidor;
            match = x.clave;
            if (match == req.query.clave ) {
                let tokenReturn = await token.encode(
                  user._id,
                  user.codigoRol,
                  codigoDistribuidor,
                  user.correo,
                  user.nombres
                );
                res.status(200).json({ user, tokenReturn });

              } else{
                return res.status(400).send("Clave/Token incorrectos.")
              
              }
             
          } else if(req.query.codigoDistribuidor=="") {
            codigoDistribuidor = undefined;
            match = x.clave;
            if (match == req.query.clave) {
              let tokenReturn = await token.encode(
                user._id,
                user.codigoRol,
                codigoDistribuidor,
                user.correo,
                user.nombres
              );
              res.status(200).json({ user, tokenReturn });
            }
          }
        });

       
      } else {
        return res.status(400).send("No existe usuario.")
      }
    } catch (e) {
      console.error(e)
      res.status(500).send({
        error: e,
      });
      next(e);
    }
  },
};
