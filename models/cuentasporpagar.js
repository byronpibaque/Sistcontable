import mongoose, { Schema } from "mongoose";
const cuentasPorPagarSch = new Schema({
    numComprobante:{type:String},
    totalFormaPago: {type:Number},
    plazo:{type:Number},
    unidadTiempo: {type:String},
    totalFactura: {type:Number},
    totalPagado:{type:Number},
    totalRetenido:{type:Number},
    numComprobanteFactura: {type:String},
    fechaFactura: {type:String},
    descripcion: {type:String},
    codigoCompra:{type:Schema.ObjectId,ref:"compras",required:true},
    codigoUsuario: { type: Schema.ObjectId, ref: "usuarios", required: true },
    codigoProveedor: { type: Schema.ObjectId, ref: "proveedors", required: true },
    codigoDistribuidor: { type: Schema.ObjectId,ref: "distribuidors",required: true,},
    estado:{type:Number,default:0},
    createdAt: { type: Date, default: Date.now },
});
const cuentasporpagar = mongoose.model("cuentasporpagar", cuentasPorPagarSch);
export default cuentasporpagar;
