// src/models/Persona.ts
import { Schema, model, Types } from 'mongoose';

const personaSchema = new Schema({
  id_user: { type: Types.ObjectId, ref: 'User', required: true },
  codigoEstudiante: { type: String, required: true, unique: true },
  nombres: { type: String, required: true },
  apellidos: { type: String, required: true },
  correo: { type: String, required: true },
  carrera: { type: String, required: true },
  biografia: { type: String, default: 'Estoy en biblioinfo' },
  librosGuardados: [{ type: Types.ObjectId, ref: 'Libro' }], // referencias a libros
  librosSugeridos: { type: Number, default: 0 },
  resenasUtiles: { type: Number, default: 0 },
  estado: {type: Boolean, default: true}
});

export const Persona = model('Persona', personaSchema);
