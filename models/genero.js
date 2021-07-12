import mongoose,{Schema} from 'mongoose';

const Genero = new Schema({
    descripcion:{type:String, maxlength:50,unique:true,required:true},
    estado: {type:Number,default:1},
    createdAt:{type:Date,default:Date.now}
});

const Genero_esquema = mongoose.model('genero',Genero);

export default Genero_esquema;