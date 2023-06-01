import models from '../models';
var pdf = require('html-pdf');
var moment = require('moment');  

const plantillaReporte = ( rows ) => {
    let html = /*html*/
    `<!DOCTYPE html>
    <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Certificado de Votacion</title>
          
          <style>
            body{
                font-size: 9px;
                width: 100%;
            }
            .border-table{
                border-color: rgb(191 176 176 / 54%);
                border-width: 1px;
                border-style: solid;
            }
            .text-xs-center{
                text-align: center;
            }
            .table-encabezado{
                position: relative; 
                left: 12%; 
                top: 30%; 
                text-align:center; 
                font-weight: 700;
                font-size: 12px;
            }
          </style>
      </head>
      <body>  
      <br><br><br>
      <table class="table-encabezado">
            <tr>
                <td>BODEGA GUILLERMO MORALES (COFARMO)</td>
            </tr>
            <tr>
                <td>REGISTRO DE TEMPERATURA Y HUMEDAD RELATIVA AMBIENTAL POSICIÓN</td>
            </tr>
      </table>
      <br><br>
      <table style="position: relative; left: 7%; top: 30%; border-collapse: collapse;" >
        <thead>
            <tr class="border-table">   
                <th rowspan="2" class="border-table" 
                    style="padding-left: 14px; padding-right: 14px">FECHA</th>      
                <th colspan="2" class="border-table" style="padding-left: 8px; padding-right: 8px">
                    TEMPERATURA AMBIENTE (°C)
                </th>      
                <th colspan="2" class="border-table" style="padding-left: 8px; padding-right: 8px">
                    HUMEDAD RELATIVA (%)
                </th>
                <th rowspan="2" class="border-table">NO. TERMOHIGROMÉTRO</th> 
            </tr>
            <tr class="border-table">      
                <th class="border-table">MAÑANA</th>
                <th class="border-table">TARDE</th>      
                <th class="border-table">MAÑANA</th>
                <th class="border-table">TARDE</th>
            </tr>
        </thead>
        <tbody>`;

        rows.forEach( row => {
            html +=/*html*/ 
                `<tr>            
                    <td class="text-xs-center border-table">
                        ${ moment(row.fecha).add(1, 'days').format('DD/MM/YYYY') }
                    </td>
                    <td class="text-xs-center border-table">
                        ${ row.temperatura_morning }°C
                    </td>
                    <td class="text-xs-center border-table">
                        ${ row.temperatura_tarde }°C
                    </td>
                    <td class="text-xs-center border-table">
                        ${ row.humedad_morning }%
                    </td>
                    <td class="text-xs-center border-table">
                        ${ row.humedad_tarde }%
                    </td>
                    <td class="text-xs-center border-table">
                        ${ row.noTermohigrometro }
                    </td>
                </tr>`
        })

    html += /*html*/ `</tbody>
            </table>
            </body>
        </html>`
    
    return html;    
}

export default {
    add: async (req,res,next) =>{
        try {
            //Validar si ya existe un registro en esa fecha
            const existe = await models.Temp_Humedad.find({ 
                fecha: req.body.fecha, 
                noTermohigrometro:  req.body.noTermohigrometro
            })

            let msg = 'Registro agregado exitosamente';
            let status = 200;
            if (existe.length < 1) 
                await models.Temp_Humedad.create( req.body )                
            else{
                msg = `Ya se agrego temperatura y humedad para la siguiente fecha ${ req.body.fecha }`
                status = 500;
            }

            res.json({ msg, status })
        } catch (e){
            res.status(500).send({ 
                message:'Error al agregar temp y humed.' + e 
            });
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
            const { date, termo } = req.query;

            let options = {
                fecha: { 
                    $gte: new Date(`${ date }-01`), 
                    $lte: new Date(`${ date }-31`)
                }
            }

            if (termo != 'General') 
                options.noTermohigrometro = termo
                        
            const list = await models.Temp_Humedad.find( options ).sort({ fecha: -1 })
            
            res.json({ list })
        } catch (e){
            res.status(500).send({ message:'Error al obtener temp y humed.' + e });
            next(e);
        } 
    },
    reportePDF: async (req,res,next) => {
        const { rows } = req.body;

        //Formatear Fecha

        var options = { 
            format: 'A5',
            paginationOffset: 1,       // Override the initial pagination number
            header: { "height": "2mm" },
            footer: { "height": "10mm" } 
        };

        const contenido = await plantillaReporte( rows )

        try {
            pdf.create(contenido, options).toStream((error, stream) => {
                if (error) { respuesta.end("Error creando PDF: " + error)} 
                else{
                    res.setHeader("Content-Type", "application/pdf");
                    stream.pipe(res);
                }
            });
        } catch (e){
            res.status(500).send({ message:'Error al obtener temp y humed.' + e });
            next(e);
        } 
    },
    delete: async (req, res, next) =>{
        try {
            await models.Temp_Humedad.deleteOne({ _id: req.params.id });

            res.json({ msg: 'OK' })
        } catch (e){
            res.status(500).send({ message:'Error al obtener temp y humed.' + e });
            next(e);
        } 
    }
}
