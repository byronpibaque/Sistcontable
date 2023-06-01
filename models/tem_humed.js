import mongoose,{Schema} from 'mongoose';

const Esquema = new Schema({ 
    fecha:              { type:Date },
    temperatura_morning:{ type: String },
    humedad_morning:    { type: String },
    temperatura_tarde:  { type: String },
    humedad_tarde:      { type: String },
    noTermohigrometro:  { type: String },
    distribuidor:       { type: Schema.ObjectId, ref: 'distribuidor'},
    usuario:            { type: Schema.ObjectId, ref: 'usuarios'},
    createdAt:          { type:Date, default: Date.now }
});

const Temp_Humedad = mongoose.model('Temp_Humedad',Esquema);

export default Temp_Humedad;