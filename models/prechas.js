import mongoose,{Schema} from 'mongoose';

const Esquema = new Schema({ 
    descripcion:{type:String,required:true},
    niveles:[{
        nivel:{type:String}
    }],
    codigoUsuario:{type: Schema.ObjectId, ref:'usuarios'},
    codigoBodega :{type: Schema.ObjectId, ref:'bodegas'}, 
    estado: {type:Number,default:1},
    createdAt:{type:Date,default:Date.now},
});

const perchas = mongoose.model('perchas',Esquema);

export default perchas;