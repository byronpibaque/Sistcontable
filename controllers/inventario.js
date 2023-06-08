import models from '../models';
const path = require('path')
var moment = require('moment');  

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
    reporte: async (req,res,next) =>{
        var xl = require('excel4node');
        try {
            const reg = await models.inventario_esquema.find({
                    codigoBodega: req.body.codigoBodega
                }).populate([
                { path: 'codigoBodega',     model: 'bodega' },
                { path: 'codigoFabricante', model: 'fabricante' },
                { path: 'codigoProveedor',  model: 'proveedor' },
                { path: 'codigoUsuario',    model: 'usuario' },
                { path: 'codigoProducto',   model: 'producto' },
            ]).sort({ $natural: -1 });

            let reporteInv = [];
            reg.forEach( p => {
                if ( p.fraccionesTotales > 0 ) {
                    reporteInv.push({
                      producto: p.codigoProducto.descripcion,
                      laboratorio: p.codigoProveedor.razonsocial,
                      lote: p.codigoLote,
                      fechaElaboracion:`${moment(p.fechaElaboracion).format('DD/MM/YYYY')}`,
                      fechaVencimiento:`${moment(p.fechaCaducidad).format('DD/MM/YYYY')}`,
                      unidades: p.fraccionesTotales,
                      proveedor: p.codigoProveedor.razonsocial,
                      precio: p.pvm,
                      total: (p.pvm * p.fraccionesTotales)
                    })
                }
            })

            var wb = new xl.Workbook();
            var ws = wb.addWorksheet('Sheet 1');
            var style = wb.createStyle({
                alignment: { horizontal: ['center'] },
                font: { size: 12, bold: true },
                numberFormat: '$#,##0.00; ($#,##0.00); -'
            });
            var styleRows = wb.createStyle({
                alignment: { horizontal: ['center'] },
                font: { size: 12 },
                numberFormat: '$#,##0.00; ($#,##0.00); -'
            });

            ws.cell(1, 1).string("PRODUCTO").style(style);
            ws.cell(1, 2).string("LABORATORIO").style(style);
            ws.cell(1, 3).string("LOTE").style(style);
            ws.cell(1, 4).string("FECHA ELABORACIÓN").style(style);
            ws.cell(1, 5).string("FECHA VENCIMIENTO").style(style);
            ws.cell(1, 6).string("UNIDADES").style(style);
            ws.cell(1, 7).string("PROVEEDOR").style(style);
            ws.cell(1, 8).string("PVM").style(style);
            ws.cell(1, 9).string("TOTAL").style(style);
            
            reporteInv.forEach( (prod, index) => {
                ws.cell((index + 2), 1).string(prod.producto).style(styleRows);
                ws.cell((index + 2), 2).string(prod.laboratorio).style(styleRows);
                ws.cell((index + 2), 3).string(prod.lote).style(styleRows);
                ws.cell((index + 2), 4).string(prod.fechaElaboracion).style(styleRows);
                ws.cell((index + 2), 5).string(prod.fechaVencimiento).style(styleRows);
                ws.cell((index + 2), 6).number(prod.unidades);
                ws.cell((index + 2), 7).string(prod.proveedor).style(styleRows);
                ws.cell((index + 2), 8).number(prod.precio).style(styleRows);
                ws.cell((index + 2), 9).number(prod.total).style(styleRows);
            })

            const patchExcel = path.join(__dirname, '../archivos/', 'inventario.xlsx')

            wb.write(patchExcel, function(err, stash){
                if (err) console.log( err );
                else{
                    res.download(patchExcel);
                    return false;
                }
            });
            
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
                costoNetoDescuento:req.body.costoNetoDescuento,
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
