import mongoose, { Schema } from "mongoose";
const ingresoSchema = new Schema({
  numComprobante: { type: String, required: true },
  fechaFactura: { type: Date, required: true },
  totalImpuesto: { type: Number, required: true },
  totalDescuento: { type: Number, required: true },
  total: { type: Number, required: true },
  detalles: [
    {
      codigoRetencion: { type: String, required: true },
      codigoImpuesto: { type: String, required: true },
      baseImponible: { type: Number, required: true },
      porcentaje: { type: Number, required: true },
      valorRetenido: { type: Number, required: true },
      codigoTipoDocumento: { type: String, required: true },
      fechaEmision: { type: Date, required: true },
    },
  ],
  periodoFiscal: { type: String },
  claveAcceso: { type: String },
  codigoCompra: { type: Schema.ObjectId, ref: "compras" },
  codigoUsuario: { type: Schema.ObjectId, ref: "usuarios", required: true },
  codigoProveedor: { type: Schema.ObjectId, ref: "proveedors", required: true },
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
