import mongoose, { Schema } from "mongoose";
const ctaporCobrar = new Schema({
    numComprobante:{type:String},
    totalFormaPago: {type:Number},
    plazo:{type:Number},
    unidadTiempo: {type:String},
    totalFactura: {type:Number},
    totalPagado:{type:Number},
    numComprobanteDocumento: {type:String},
    fechaFactura: {type:String},
    descripcion: {type:String},
    codigoEgreso:{type:Schema.ObjectId,ref:"egresos"},
    // codigoVenta:{type:Schema.ObjectId,ref:"ventas"},
    codigoUsuario: { type: Schema.ObjectId, ref: "usuarios", required: true },
    codigoCliente: { type: Schema.ObjectId, ref: "clientes", required: true },
    codigoDistribuidor: { type: Schema.ObjectId,ref: "distribuidors",required: true,},
    estado:{type:Number,default:0},
    createdAt: { type: Date, default: Date.now },
});
const cuentasporcobrar = mongoose.model("cuentasporcobrar", ctaporCobrar);
export default cuentasporcobrar;
