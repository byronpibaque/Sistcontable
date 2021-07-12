import mongoose,{Schema} from 'mongoose';

const rol = new Schema({
    descripcion:{type:String, maxlength:50,unique:true,required:true},
    estado: {type:Number,default:1},
    createdAt:{type:Date,default:Date.now}
});

const Rol_esquema = mongoose.model('rol',rol);

export default Rol_esquema;