import mongoose,{Schema} from 'mongoose';

const Esquema = new Schema({ 
 
    numDocumento:{type:String,maxlength:13,required:true},
    nombres:{type:String,required:true},
    direccion:{type:String,required:true},
    telefono:{type:String,required:true},
    correo:{type:String,required:true},
    fechaNacimiento:{type:Date},
    login:[{
        usuario:{type:String,required:true,default:"indefinido"},
        clave:{type:String,maxlength:64,required:true,default:"indefinido"},
        codigoDistribuidor :{type: Schema.ObjectId, ref:'distribuidors'}, 
    }],
    codigoRol :{type: Schema.ObjectId, ref:'rols'},
    codigoGenero :{type: Schema.ObjectId, ref:'generos'},
    estado: {type:Number,default:1},
    createdAt:{type:Date,default:Date.now},
    
});

const Usuario_esquema = mongoose.model('usuario',Esquema);

export default Usuario_esquema;