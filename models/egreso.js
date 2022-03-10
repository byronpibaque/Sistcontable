import mongoose, { Schema } from "mongoose";
const egresoEsquema = new Schema({
  numComprobante: { type: String, required: true },
  fechaFactura: { type: Date, required: true },
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
      pvp: {
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
  codigoCliente: { type: Schema.ObjectId, ref: "clientes", required: true },
  codigoDistribuidor: {
    type: Schema.ObjectId,
    ref: "distribuidors",
    required: true,
  },
  codigoBodega: { type: Schema.ObjectId, ref: "bodegas" },
  estado: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
});
const egresos = mongoose.model("egresos", egresoEsquema);
export default egresos;
