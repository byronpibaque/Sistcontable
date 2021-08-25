import mongoose, { Schema } from "mongoose";
const esquema = new Schema({
  numComprobante: { type: String, required: true },
  total:{type:Number,required:true},
  formasPago:[{
    formaPago: {type:String},
    total: {type:Number},
    descripcion:{type:String}
  }],
  descripcion: { type: String },
  abonos: [
    {
      codigoCuentaxPagar: {
        type: String,
        required: true,
      },
      numComprobanteCxP: {
        type: String,
        required: true,
      },
      abono: {
        type: Number,
        required: true,
      },
      saldo: {
        type: Number,
        required: true,
      },
    }
      
  ],
  codigoUsuario: { type: Schema.ObjectId, ref: "usuarios", required: true },
  codigoDistribuidor: {
    type: Schema.ObjectId,
    ref: "distribuidors",
    required: true,
  },
  estado:{type:Number,default:0},
  createdAt: { type: Date, default: Date.now },
});
const pagosCxP = mongoose.model("pagosCxP", esquema);
export default pagosCxP;
