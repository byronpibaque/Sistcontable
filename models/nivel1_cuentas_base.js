import mongoose,{Schema} from 'mongoose';

const Esquema = new Schema({ 
    codigoNumerico:{type:String,required:true},
    descripcion:{type:String,required:true},
    codigoUsuario:{type: Schema.ObjectId, ref:'usuarios'},
    codigoDistribuidor :{type: Schema.ObjectId, ref:'distribuidors'}, 
    estado: {type:Number,default:1},
    createdAt:{type:Date,default:Date.now},
    
});

const cuentasbase = mongoose.model('cuentasbase',Esquema);

export default cuentasbase;