import mongoose,{Schema} from 'mongoose';

const Esquema = new Schema({ 
    descripcion:{type:String},
    codigoUsuario:{type: Schema.ObjectId, ref:'usuarios'},
    estado: {type:Number,default:1},
    createdAt:{type:Date,default:Date.now},
});

const concentracion_esquema = mongoose.model('concentracion',Esquema);

export default concentracion_esquema;