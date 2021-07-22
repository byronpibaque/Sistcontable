import mongoose, { Schema } from "mongoose";
const ingresoSchema = new Schema({
  secuencial: { type: String, required: true },
  ptoEmi: { type: String, required: true },
  totalImpuesto: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  total: { type: Number, required: true },
  impuestos: [
    {
      codigo: { type: String, required: true },
      codigoRetencion: { type: String, required: true },
      baseImponible: { type: Number, required: true },
      porcentajeRetener: { type: Number, required: true },
      valorRetenido: { type: Number, required: true },
      codDocSustento: { type: String, required: true },
      numDocSustento: { type: String, required: true },
      fechaEmisionDocSustento:{ type: String, required: true },
    },
  ],
  periodoFiscal: { type: String },
  claveAcceso: { type: String },
  codigoCompra: { type: Schema.ObjectId, ref: "compras" },
  codigoUsuario: { type: Schema.ObjectId, ref: "usuarios", required: true },
  codigoProveedor: { type: Schema.ObjectId, ref: "proveedors", },
  codigoDistribuidor: {
    type: Schema.ObjectId,
    ref: "distribuidors",
    required: true,
  },
  estado: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
});
const retenciones = mongoose.model("retenciones", ingresoSchema);
export default retenciones;
