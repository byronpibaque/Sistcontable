import mongoose,{Schema} from 'mongoose';

const Esquema = new Schema({ 
    codigoBarra:{ type:String,required: false },
    codigoLote:{ type: String, required: false },
    nombreComercial:{ type: String, required: false},
    registroSanitario:{type:String,required:false},
    fraccionesTotales:{type:Number,required:false},
    fechaCaducidad:{type:Date,required:false},
    fechaElaboracion:{type:Date,required:false},
    iva:{type:Number,required:false},
    descuento:{type:Number,required:false},
    pvp:{type:Number,required:false},
    punit:{type:Number,required:false},
    pvm:{type:Number,required:false},
    costoNeto:{type:Number,required:false},
    percha:{type:String},
    numComprobante:{type:String},
    codigoUsuario:{type: Schema.ObjectId, ref:'usuarios'},
    codigoBodega :{type: Schema.ObjectId, ref:'bodegas'}, 
    codigoFabricante :{type: Schema.ObjectId, ref:'fabricantes'},
    codigoProveedor :{type: Schema.ObjectId, ref:'proveedors'},  
    codigoProducto :{type: Schema.ObjectId, ref:'productos'}, 
    estado: { type:Number, default:1 },
    detalle: [{
        numComprobante: { type: String },
        percha:         { type: String },
        cantidad:       { type: Number },
        temperatura:    { type: Number, default: null },
        createdAt:      { type: Date, default: Date.now }
    }],
    createdAt:{type:Date,default:Date.now},
});

const inventario_esquema = mongoose.model('inventario',Esquema);

export default inventario_esquema;