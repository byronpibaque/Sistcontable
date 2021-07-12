import mongoose, { Schema } from "mongoose";
const esquema = new Schema({
  numComprobante: { type: String, required: true },
  descripcion: { type: String },
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
      cantidad: {
        type: Number,
        required: true,
      },
      fracciones: {
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
      descuento: {
        type: Number,
        required: true,
      },
      iva: {
        type: Number,
        required: true,
      },
      estado:{type:Number,default:0},
      percha:{type:String,default:""}
    },
  ],
  codigoUsuario: { type: Schema.ObjectId, ref: "usuarios", required: true },
  codigoDistribuidor: {
    type: Schema.ObjectId,
    ref: "distribuidors",
    required: true,
  },
  codigoBodega :{type: Schema.ObjectId, ref:'bodegas'},
  estado:{type:Number,default:1},
  createdAt: { type: Date, default: Date.now },
});
const asignacionPercha = mongoose.model("asignacionPercha", esquema);
export default asignacionPercha;
