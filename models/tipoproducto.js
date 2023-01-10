import mongoose,{Schema} from 'mongoose';

const Esquema = new Schema({ 
    descripcion:{type:String},
    codigoUsuario:{type: Schema.ObjectId, ref:'usuarios'},
    estado: {type:Number,default:1},
    createdAt:{type:Date,default:Date.now},
});

const tipoProducto_esquema = mongoose.model('tipoProducto',Esquema);

export default tipoProducto_esquema;