import mongoose,{Schema} from 'mongoose';

const Esquema = new Schema({ 
    ruc:{type:String,maxlength:13},
    razonsocial:{type:String,required:true},
    direccion:{type:String},
    contacto:[{
        nombres:{type:String},
        telefono:{type:String},
        correo:{type:String}
    }],
    codigoUsuario:{type: Schema.ObjectId, ref:'usuarios'},
    estado: {type:Number,default:1},
    createdAt:{type:Date,default:Date.now},
});

const proveedor_esquema = mongoose.model('proveedor',Esquema);

export default proveedor_esquema;