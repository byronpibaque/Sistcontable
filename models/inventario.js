import mongoose,{Schema} from 'mongoose';

const Esquema = new Schema({ 
    codigoBarra:{type:String,required:true},
    codigoLote:{type:String,required:true},
    nombreComercial:{type:String,required:true},
    fraccionesTotales:{type:Number,required:true},
    fechaCaducidad:{type:String,required:true},
    fechaElaboracion:{type:String,required:true},
    iva:{type:Number,required:true},
    descuento:{type:Number,required:true},
    pvp:{type:Number,required:true},
    punit:{type:Number,required:true},
    pvm:{type:Number,required:true},
    costoNeto:{type:Number,required:true},
    percha:{type:String},
    codigoUsuario:{type: Schema.ObjectId, ref:'usuarios'},
    codigoBodega :{type: Schema.ObjectId, ref:'bodegas'}, 
    codigoFabricante :{type: Schema.ObjectId, ref:'fabricantes'},
    codigoProveedor :{type: Schema.ObjectId, ref:'proveedors'},  
    codigoProducto :{type: Schema.ObjectId, ref:'productos'}, 
    estado: {type:Number,default:1},
    createdAt:{type:Date,default:Date.now},
});

const inventario_esquema = mongoose.model('inventario',Esquema);

export default inventario_esquema;