import mongoose, { Schema } from "mongoose";
const ingresoSchema = new Schema({
  claveAcceso: { type: String, required: true },
  numComprobante: { type: String, required: true },
  fechaFactura: { type: String, required: true },
  totalImpuesto: { type: Number, required: true },
  totalRetenido:{ type: Number },
  totalDescuento: { type: Number, required: true },
  total: { type: Number, required: true },
  subTotal: { type: Number, required: true },
  formaPago:[{
    formaPago: {type:String},
    total: {type:Number},
    plazo: {type:Number},
    unidadTiempo: {type:String}
  }],
  detalles: [
    {
      _id: {
        type: String,
        required: true,
      },
      producto: {
        type: String,
        required: true,
      },
      fraccionesTotales: {
        type: Number,
        required: true,
      },
      fxcaja: {
        type: Number,
        required: true,
      },
      fracciones: {
        type: Number,
        required: true,
      },
      cantidad: {
        type: Number,
        required: true,
      },
      bonificacion: {
        type: Number,
        required: true,
      },
      costoNeto: {
        type: Number,
        required: true,
      },
      pvp: {
        type: Number,
        required: true,
      },
      pvm: {
        type: Number,
        required: true,
      },
      punit: {
        type: Number,
        required: true,
      },
      iva: {
        type: Number,
        required: true,
      },
      descuento: {
        type: Number,
        required: true,
      },
    },
  ],
  descripcion: { type: String },
  codigoUsuario: { type: Schema.ObjectId, ref: "usuarios", required: true },
  codigoProveedor: { type: Schema.ObjectId, ref: "proveedors", required: true },
  codigoDistribuidor: {
    type: Schema.ObjectId,
    ref: "distribuidors",
    required: true,
  },
  codigoBodega :{type: Schema.ObjectId, ref:'bodegas'},
  estado:{type:Number,default:1},
  createdAt: { type: Date, default: Date.now },
});
const compras = mongoose.model("compras", ingresoSchema);
export default compras;
