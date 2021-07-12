import mongoose,{Schema} from 'mongoose';

const Esquema = new Schema({ 
    codigoNumerico:{type:String,required:true},
    descripcion:{type:String,required:true},
    codigoCuentabase:{type: Schema.ObjectId, ref:'cuentasbases'},
    codigoGrupofinanciero:{type: Schema.ObjectId, ref:'grupofinancieros'},
    codigoUsuario:{type: Schema.ObjectId, ref:'usuarios'},
    codigoDistribuidor :{type: Schema.ObjectId, ref:'distribuidors'}, 
    estado: {type:Number,default:1},
    createdAt:{type:Date,default:Date.now},
    
});

const cuentascontrol = mongoose.model('cuentascontrol',Esquema);

export default cuentascontrol;