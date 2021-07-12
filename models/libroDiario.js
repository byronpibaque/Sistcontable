import mongoose,{Schema} from 'mongoose';

const Esquema = new Schema({ 
 
    descripcion:{type:String,required:true},
    debe:{type:Number},
    haber:{type:Number},
    codigoCuenta:{type: Schema.ObjectId, ref:'cuentamovimientos'},
    codigoUsuario:{type: Schema.ObjectId, ref:'usuarios'},
    codigoDistribuidor :{type: Schema.ObjectId, ref:'distribuidors'}, 
    estado: {type:Number,default:1},
    createdAt:{type:Date,default:Date.now},
    
});

const libroDiario = mongoose.model('librodiario',Esquema);

export default libroDiario;