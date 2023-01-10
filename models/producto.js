import mongoose,{Schema} from 'mongoose';

const Esquema = new Schema({ 

    descripcion:{type:String,required:true},
    fraccionCaja:{type:Number,required:true},
    contenidoNeto:{type:String,required:true},
    detalleConcentracion:{type:String,required:true},
    codigoUsuario:{type: Schema.ObjectId, ref:'usuarios'},
    codigoTipoproducto:{type: Schema.ObjectId, ref:'tipoProductos'},
    codigoPrincipioactivo:{type: Schema.ObjectId, ref:'principioActivos'},
    codigoPresentacion:{type: Schema.ObjectId, ref:'presentacions'},
    codigoConcentracion:{type: Schema.ObjectId, ref:'concentracions'},
    estado: {type:Number,default:1},
    createdAt:{type:Date,default:Date.now},
});

const producto_esquema = mongoose.model('producto',Esquema);

export default producto_esquema;