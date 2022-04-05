import mongoose, { Schema } from "mongoose";
const Esquema = new Schema({
  numComprobante: { type: String, required: true },
  ptoEmision:{type:Number,required:true},
  claveAcceso:{type:String},
  totalImpuesto: { type: Number, required: true },
  totalDescuento: { type: Number, required: true },
  total: { type: Number, required: true },
  subTotal: { type: Number, required: true },
  formaPago: [
    {
      formaPago: { type: String },
      total: { type: Number },
      plazo: { type: Number },
      unidadTiempo: { type: String },
    },
  ],
  detalles: [
    {
      _id: {
        type: String,
        required: true,
      },
      descripcion: {
        type: String,
        required: true,
      },
      nombreComercial: {
        type: String,
        required: true,
      },
      cantidad: {
        type: Number,
        required: true,
      },
      precioUni: {
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
      codigoAuxiliar: {
        type: String,
        required: true,
      },
      codigoBarra: {
        type: String,
        required: true,
      },
      registroSanitario: {
        type: String,
        required: true,
      },
      fechas: {
        type: String,
        required: true,
      },

    },
  ],
 
  codigoUsuario: { type: Schema.ObjectId, ref: "usuarios", required: true },
  codigoCliente: { type: Schema.ObjectId, ref: "clientes", required: true },
  codigoDistribuidor: {
    type: Schema.ObjectId,
    ref: "distribuidors",
    required: true,
  },
  codigoBodega: { type: Schema.ObjectId, ref: "bodegas" },
  estado: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});
const facturas = mongoose.model("facturas", Esquema);
export default facturas;
