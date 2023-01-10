import mongoose,{Schema} from 'mongoose';
const esquema = new Schema({
    tipoDocumento:{type:String},
    numDocumento: {type: String,maxlength:13},
    nombres:{type:String,maxlength:100,unique:true,required:true},
    direccion: { type:String, maxlength:100},
    telefono: { type:String, maxlength:10},
    email: { type:String, maxlength:100, unique:true},
    estado:{type:Number,default:1},
    createdAt:{type:Date,default:Date.now}
});
const Cliente = mongoose.model('cliente',esquema);
export default Cliente;