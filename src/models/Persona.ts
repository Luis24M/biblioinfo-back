// src/models/Persona.ts
import { Schema, model, Types } from 'mongoose';

const personaSchema = new Schema({
  id_user: { type: Types.ObjectId, ref: 'User', required: true },
  nombres: { type: String, required: true },
  apellidos: { type: String, required: true },
  correo: { type: String, required: true },
  carrera: { type: String, required: true },
  biografia: { type: String },
  librosGuardados: [{ type: Types.ObjectId, ref: 'Libro' }], // referencias a libros
  librosSugeridos: { type: Number, default: 0 },
  resenasUtiles: { type: Number, default: 0 },
});

export const Persona = model('Persona', personaSchema);
