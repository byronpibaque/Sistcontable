import mongoose,{Schema} from 'mongoose';

const Esquema = new Schema({ 
    distribuidor:             { type: Schema.ObjectId, ref: 'distribuidor'},
    usuario:                  { type: Schema.ObjectId, ref: 'usuarios'},
    fecha:                    { type:Date },
    lugar:                    { type: String },
    RPIS:                     { type: String },
    nombreEntidadContratante: { type: String },
    rucEntidadContratante:    { type: String },
    direccionContratante:     { type: String },
    nombreProveedor:          { type: String },
    rucProveedor:             { type: String },
    tipoContrato:             { type: String },
    numContrato:              { type: String },
    detalles: [
      {
        producto_id: {
          type: Schema.ObjectId, 
          ref: "productos", 
          required: true
        },
        vidaUtil: {
          type: String
        },
        unidades: {
          type: Number
        },
        p_unitario: {
          type: Number
        },
        p_total: {
          type: Number
        }
      }
    ],
    estado:{ type: Number, default:1 },
    createdAt: { type:Date, default: Date.now }
});

const Acta_Entrega = mongoose.model('Acta_Entrega',Esquema);

export default Acta_Entrega;