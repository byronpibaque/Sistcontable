import mongoose,{Schema} from 'mongoose';

const Esquema = new Schema({ 
  
    secuenciales:[{
        secuencial:{type:Number,required:true},
        documento:{type:String},
    }],
    ptoEmision:{type:Number,required:true},
    codigoUsuario:{type: Schema.ObjectId, ref:'usuarios'},
    codigoDistribuidor :{type: Schema.ObjectId, ref:'distribuidors'}, 
  
    estado: {type:Number,default:1},
    createdAt:{type:Date,default:Date.now},
});

const data_esquema = mongoose.model('data',Esquema);

export default data_esquema;