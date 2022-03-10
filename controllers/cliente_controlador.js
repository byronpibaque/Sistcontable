
import Persona from '../models/clientes';

export default {
    add: async (req,res,next) =>{
        try {
            const reg = await Persona.create(req.body);
            res.status(200).json(reg);
        } catch (e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    buscarCliente: async (req,res,next) => {
        try {
            Persona
            .findOne({$or:[{"numDocumento":req.query.data},
            // {"nombres":req.query.data},
            {'nombres': new RegExp('^'+req.query.data,'i')},
            {'nombres':  new RegExp(req.query.data+'$','i')},
            {'nombres': new RegExp('^'+req.query.data,'i')},
            {'nombres':  new RegExp(req.query.data+'$','i')},
        ]})
            .exec(function (err,persona) {
                    if(err)  
                    return res.status(500).send({
                                    message:'Ocurrió un error: '+err
                                 });
                   
                                 if(!persona){
                                    res.status(206).send({message:"No existe ningun registro para:"+req.query.data})
                                }else{
                                    res.status(200).send(persona); 
                                } 
                  
                    
                }) 
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    query: async (req,res,next) => {
        try {
            Persona.findOne({_id:req.query._id}).exec(function (err,persona) {
                    if(err)  
                    return res.status(500).send({
                                    message:'Ocurrió un error: '+err
                                 });
                    if(persona){
                     res.status(200).send(persona);    
                    }
                    
                }) 
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    list: async (req,res,next) => {
        try {
            let valor=req.query.valor;
            Persona.find({$or:[{'nombres':new RegExp(valor,'i')},
            {'email':new RegExp(valor,'i')}]}).exec(function (err,persona) {
                if(err)throw  res.status(500).send({
                                message:'Ocurrió un error: '+err
                             });
                if(persona){
                 res.status(200).send(persona);    
                }
                
            })
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    listClientes: async (req,res,next) => {
        try {

            let valor=req.query.valor;
            Persona.find({$or:[{'nombres':new RegExp(valor,'i')},
            {'email':new RegExp(valor,'i')}]}).exec(function (err,persona) {
                if(err)throw  res.status(500).send({
                                message:'Ocurrió un error: '+err
                             });
                if(persona){
                 res.status(200).send(persona);    
                }
                
            })
  
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    query_cedula: async (req,res,next) => {
        try {
            let numDocumento=req.query.cedula;
            Persona.find({$and:[{numDocumento:numDocumento}]}).exec(function (err,persona) {
                if(err)throw  res.status(500).send({
                                message:'Ocurrió un error: '+err
                             });
                if(persona.length!=0){
                 res.status(200).send(persona);    
                }else{
                    res.status(204).send({
                        message:'No hay datos.'
                    });    
                }
                
            })
  
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'+e
            });
            next(e);
        }
    },
    listPropietarios: async (req,res,next) => {
        try {

            let valor=req.query.valor;
            Persona.find({$or:[{'nombres':new RegExp(valor,'i')},
            {'email':new RegExp(valor,'i')}]}).exec(function (err,persona) {
                if(err)throw  res.status(500).send({
                                message:'Ocurrió un error: '+err
                             });
                if(persona){
                 res.status(200).send(persona);    
                }
                
            })
  
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    listProveedores: async (req,res,next) => {
        try {
            let valor=req.query.valor;
            Persona.find({$or:[{'nombres':new RegExp(valor,'i')},
            {'email':new RegExp(valor,'i')}]}).exec(function (err,persona) {
                if(err)throw  res.status(500).send({
                                message:'Ocurrió un error: '+err
                             });
                if(persona){
                 res.status(200).send(persona);    
                }
                
            })
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    update: async (req,res,next) => {
        try {         
            const reg = await Persona.findByIdAndUpdate({_id:req.body._id},
                {   tipoDocumento:req.body.tipoDocumento,
                    numDocumento:req.body.numDocumento,
                    nombres:req.body.nombres,
                    direccion:req.body.direccion,
                    telefono:req.body.telefono,
                    email:req.body.email,
                   
                });
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    remove: async (req,res,next) => {
        try {
            const reg = await Persona.findByIdAndDelete({_id:req.query._id});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    activate: async (req,res,next) => {
        try {
            const reg = await Persona.findByIdAndUpdate({_id:req.body._id},{estado:1});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    deactivate:async (req,res,next) => {
        try {
            const reg = await Persona.findByIdAndUpdate({_id:req.body._id},{estado:0});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    }
}
