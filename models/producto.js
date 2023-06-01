import mongoose,{Schema} from 'mongoose';

const Esquema = new Schema({ 

    descripcion:{type:String,required:true},
    fraccionCaja:{type:Number,required:true},
    contenidoNeto:{type:String,required:false},
    detalleConcentracion:{type:String,required:false},
    codigoUsuario:{type: Schema.ObjectId, ref:'usuarios', required: false},
    codigoTipoproducto:{type: Schema.ObjectId, ref:'tipoProductos', required: false},
    codigoPrincipioactivo:{type: Schema.ObjectId, ref:'principioActivos', required: false},
    codigoPresentacion:{type: Schema.ObjectId, ref:'presentacions', required: false},
    codigoConcentracion:{type: Schema.ObjectId, ref:'concentracions', required:false},
    estado: {type:Number,default:1},
    createdAt:{type:Date,default:Date.now},
});

const producto_esquema = mongoose.model('producto',Esquema);

export default producto_esquema;