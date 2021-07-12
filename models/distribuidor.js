import mongoose,{Schema} from 'mongoose';

const distribuidor = new Schema({
    ruc:{type:String, maxlength:13,unique:true,required:true},
    razonSocial:{type:String,required:true},
    nombreComercial:{type:String,required:true},
    fechaInicioAct:{type:String},
    obligadoContabilidad:{type:Number,default:0},
    direccion:{type:String},
    correo:{type:String},
    establecimientos:[{
        numEstablecimiento:{type:String},
        tipoEstablecimiento:{type:String},
        estadoEstablecimiento:{type:Number,default:1},
        nombreComercialEstablecimiento:{type:String},
        direccionEstablecimiento:{type:String}
    }],
    estado: {type:Number,default:1},
    createdAt:{type:Date,default:Date.now}
});

const distribuidor_esquema = 
mongoose.model('distribuidor',distribuidor);

export default distribuidor_esquema;