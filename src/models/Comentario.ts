import { Schema, model, Document, Types } from 'mongoose';

export interface IComentario extends Document {
  cantidad_estrellas_comentario: number;
  fecha_comentario: Date;
  id_libro: Types.ObjectId;
  contenido_comentario: string;
  id_persona: Types.ObjectId;
  estado_comentario: boolean;
  reportado: Types.ObjectId[];
  respuestas: IRespuesta[];
}

export interface IRespuesta extends Document {
  id_persona: Types.ObjectId;
  contenido_respuesta: string;
  fecha_respuesta: Date;
  estado_respuesta: boolean;
  reportado: Types.ObjectId[];
}

const RespuestaSchema = new Schema<IRespuesta>({
  id_persona: { type: Schema.Types.ObjectId, ref: 'Persona', required: true },
  contenido_respuesta: { type: String, required: true },
  fecha_respuesta: { type: Date, default: Date.now },
  estado_respuesta: { type: Boolean, default: true },
  reportado: [{ type: Schema.Types.ObjectId, ref: 'ReporteRespuesta' }],
});

const ComentarioSchema = new Schema<IComentario>({
  id_persona: { type: Schema.Types.ObjectId, ref: 'Persona', required: true },
  id_libro: { type: Schema.Types.ObjectId, ref: 'Libro', required: true },
  cantidad_estrellas_comentario: { type: Number, min: 1, max: 5 },
  contenido_comentario: { type: String, required: true },
  fecha_comentario: { type: Date, default: Date.now },
  estado_comentario: { type: Boolean, default: true },
  reportado: [{ type: Schema.Types.ObjectId, ref: 'ReporteComentario' }],
  respuestas: [RespuestaSchema],
});



// Índices (se eliminó el índice único para permitir múltiples comentarios por usuario por libro)
ComentarioSchema.index({ id_libro: 1 }); // Índice simple para optimizar búsquedas por libro
ComentarioSchema.index({ id_persona: 1 }); // Índice simple para optimizar búsquedas por persona

export const Comentario = model<IComentario>('Comentario', ComentarioSchema);