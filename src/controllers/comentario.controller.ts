import { Request, Response } from 'express';
import { Comentario, IComentario, IRespuesta } from '../models/Comentario';
import { successResponse, errorResponse } from '../utils/apiResponse';
import { Libro } from '../models/Libro';
import { Types } from 'mongoose';


// Interface for request body validation
interface CreateComentarioBody {
  id_libro: string;
  id_persona: string;
  contenido_comentario: string;
  cantidad_estrellas_comentario: number;
}

interface AddReplyBody {
  id_persona: string;
  contenido_respuesta: string;
}

export async function createComentario(req: Request<{}, {}, CreateComentarioBody>, res: Response) {
  try {
    const { id_libro, id_persona, contenido_comentario, cantidad_estrellas_comentario } = req.body;

    // Validate required fields
    if (!id_libro || !id_persona || !contenido_comentario || !cantidad_estrellas_comentario) {
       res.status(400).json(errorResponse('Faltan campos requeridos', 400));
    }

    // Validate IDs
    if (!Types.ObjectId.isValid(id_libro) || !Types.ObjectId.isValid(id_persona)) {
       res.status(400).json(errorResponse('ID de libro o persona no válido', 400));
    }

    // Validate rating
    if (cantidad_estrellas_comentario < 1 || cantidad_estrellas_comentario > 5) {
       res.status(400).json(errorResponse('La calificación debe estar entre 1 y 5', 400));
    }

    // Create new comment
    const nuevo = new Comentario({
      id_libro,
      id_persona,
      contenido_comentario,
      cantidad_estrellas_comentario,
    });

    // Save comment
    await nuevo.save();

    // Get all active comments for the book
    const comentarios = await Comentario.find({ id_libro, estado_comentario: true });

    // Calculate average rating
    const totalEstrellas = comentarios.reduce(
      (sum, comentario) => sum + comentario.cantidad_estrellas_comentario,
      0
    );
    const promedioEstrellas = comentarios.length > 0 ? totalEstrellas / comentarios.length : 0;

    // Update book with new comment ID and average rating
    const libroActualizado = await Libro.findByIdAndUpdate(
      id_libro,
      {
        $push: { comentarios: nuevo._id },
        $set: { estrellas: promedioEstrellas },
      },
      { new: true }
    );

    // Verify book exists
    if (!libroActualizado) {
      await Comentario.findByIdAndDelete(nuevo._id);
       res.status(404).json(errorResponse('Libro no encontrado', 404));
    }

    // Populate comment data
    const populatedComment = await Comentario.findById(nuevo._id)
      .populate('id_persona', 'nombres apellidos')
      .populate('id_libro', 'titulo autor categoria anio issbn sinopsis imagen_portada estado_libro fecha_libro comentarios estrellas ruta_libro');

     res.status(201).json(successResponse('Comentario creado', populatedComment));
  } catch (error) {
    console.error('Error creating comentario:', error);
     res.status(500).json(errorResponse('Error al crear comentario', 500, error));
  }
}

export async function getComentarios(req: Request, res: Response) {
  try {
    const comentarios = await Comentario.find({ estado_comentario: true })
      .populate({
        path: 'id_persona',
        select: 'nombres apellidos',
      })
      .populate({
        path: 'id_libro',
        select: 'titulo autor categoria anio issbn sinopsis imagen_portada estado_libro fecha_libro comentarios estrellas ruta_libro',
      })
      .populate({
        path: 'respuestas.id_persona',
        select: 'nombres apellidos',
      });

     res.status(200).json({
      success: true,
      status: 200,
      message: 'Comentarios obtenidos',
      data: comentarios,
    });
  } catch (error) {
    console.error('Error fetching comentarios:', error);
     res.status(500).json({
      success: false,
      message: 'Error al obtener los comentarios',
    });
  }
}

export async function addReply(req: Request<{ id: string }, {}, AddReplyBody>, res: Response) {
  try {
    const { id } = req.params;
    const { id_persona, contenido_respuesta } = req.body;

    // Validate required fields
    if (!id_persona || !contenido_respuesta) {
       res.status(400).json(errorResponse('id_persona y contenido_respuesta son obligatorios', 400));
    }

    // Validate comment ID
    if (!Types.ObjectId.isValid(id)) {
       res.status(400).json(errorResponse('ID de comentario no válido', 400));
    }

    // Validate persona ID
    if (!Types.ObjectId.isValid(id_persona)) {
       res.status(400).json(errorResponse('ID de persona no válido', 400));
    }

    // Validate reply length
    if (contenido_respuesta.length > 500) {
       res.status(400).json(errorResponse('La respuesta no debe exceder los 500 caracteres', 400));
    }

    // Find comment
    const comment = await Comentario.findOne({ _id: id, estado_comentario: true });

    if (!comment) {
       res.status(404).json(errorResponse('Comentario no encontrado o inactivo', 404));
    }

    // Add new reply to respuestas array
    comment?.respuestas.push({
      id_persona: id_persona,
      contenido_respuesta,
      fecha_respuesta: new Date(),
      estado_respuesta: true,
      reportado: [],
    } as any);
    comment?.markModified('respuestas');

    // Save the updated comment
    await comment?.save();

    // Fetch the updated comment with populated fields
    const updatedComment = await Comentario.findById(id)
      .populate({
        path: 'respuestas.id_persona',
        select: 'nombres apellidos',
      })
      .lean();

    if (!updatedComment) {
       res.status(404).json(errorResponse('Comentario no encontrado después de actualizar', 404));
    }

    // Get the newly added reply
    const addedReply = updatedComment?.respuestas[updatedComment?.respuestas.length - 1];

     res.status(201).json(successResponse('Respuesta añadida', addedReply));
  } catch (error) {
    console.error('Error adding reply:', error);
     res.status(500).json(errorResponse('Error al añadir respuesta', 500, error));
  }
}

export async function getComentariosPorPersona(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
       res.status(400).json(errorResponse('ID de persona no válido', 400));
    }

    const comentarios = await Comentario.find({ id_persona: id, estado_comentario: true })
      .populate('id_libro', 'titulo autor categoria anio issbn sinopsis imagen_portada estado_libro fecha_libro comentarios estrellas ruta_libro')
      .populate('id_persona', 'nombres apellidos')
      .populate('respuestas.id_persona', 'nombres apellidos');

     res.status(200).json(successResponse('Comentarios obtenidos', comentarios));
  } catch (error) {
    console.error('Error fetching comentarios por persona:', error);
     res.status(500).json(errorResponse('Error al obtener comentarios por persona', 500, error));
  }
}

export async function getComentariosPorLibro(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json(errorResponse('ID de libro no válido', 400));
      return;
    }

    // Obtener los comentarios
    const comentarios = await Comentario.find({ id_libro: id, estado_comentario: true })
      .populate('id_persona', 'nombres apellidos')
      .populate('id_libro', 'titulo autor categoria anio issbn sinopsis imagen_portada estado_libro fecha_libro comentarios estrellas ruta_libro')
      .populate('respuestas.id_persona', 'nombres apellidos')
      .lean(); // importante para poder manipular los objetos luego

    // Filtrar respuestas activas
    const comentariosFiltrados = comentarios.map((comentario) => {
      return {
        ...comentario,
        respuestas: comentario.respuestas.filter((r: any) => r.estado_respuesta === true),
      };
    });

    res.status(200).json(successResponse('Comentarios obtenidos', comentariosFiltrados));
  } catch (error) {
    console.error('Error fetching comentarios por libro:', error);
    res.status(500).json(errorResponse('Error al obtener comentarios por libro', 500, error));
  }
}


export async function updateComentario(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
       res.status(400).json(errorResponse('ID de comentario no válido', 400));
    }

    const actualizado = await Comentario.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('id_persona', 'nombres apellidos')
      .populate('id_libro', 'titulo autor categoria anio issbn sinopsis imagen_portada estado_libro fecha_libro comentarios estrellas ruta_libro')
      .populate('respuestas.id_persona', 'nombres apellidos');

    if (!actualizado) {
       res.status(404).json(errorResponse('Comentario no encontrado', 404));
    }

     res.status(200).json(successResponse('Comentario actualizado', actualizado));
  } catch (error) {
    console.error('Error updating comentario:', error);
     res.status(500).json(errorResponse('Error al actualizar comentario', 500, error));
  }
}

export async function deleteComentario(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
       res.status(400).json(errorResponse('ID de comentario no válido', 400));
    }

    const actualizado = await Comentario.findByIdAndUpdate(
      id,
      { estado_comentario: false },
      { new: true }
    );

    if (!actualizado) {
       res.status(404).json(errorResponse('Comentario no encontrado', 404));
    }

     res.status(200).json(successResponse('Comentario eliminado lógicamente'));
  } catch (error) {
    console.error('Error deleting comentario:', error);
     res.status(500).json(errorResponse('Error al eliminar comentario', 500, error));
  }
}

export async function deleteReply(req: Request, res: Response): Promise<void> {
  try {
    const { idComentario, idRespuesta } = req.params;

    if (!Types.ObjectId.isValid(idComentario) || !Types.ObjectId.isValid(idRespuesta)) {
      res.status(400).json(errorResponse('IDs de comentario o respuesta no válidos', 400));
      return;
    }

    // 1. Marcar la respuesta como inactiva
    const comentario = await Comentario.findOneAndUpdate(
      {
        _id: idComentario,
        'respuestas._id': idRespuesta,
      },
      {
        $set: {
          'respuestas.$.estado_respuesta': false,
        },
      },
      { new: true }
    );

    if (!comentario) {
      res.status(404).json(errorResponse('Comentario o respuesta no encontrada', 404));
      return;
    }

    // 2. Volver a buscar el comentario con solo respuestas activas
    const comentarioFiltrado = await Comentario.findById(idComentario)
      .populate('id_persona', 'nombres apellidos')
      .populate({
        path: 'respuestas.id_persona',
        select: 'nombres apellidos',
      })
      .lean();

    if (!comentarioFiltrado) {
      res.status(404).json(errorResponse('Comentario no encontrado después de actualizar', 404));
      return;
    }

    // 3. Filtrar respuestas activas
    comentarioFiltrado.respuestas = comentarioFiltrado.respuestas?.filter(
      (respuesta: any) => respuesta.estado_respuesta === true
    );

    res.status(200).json(successResponse('Respuesta eliminada lógicamente', comentarioFiltrado));
  } catch (error) {
    console.error('Error al eliminar respuesta:', error);
    res.status(500).json(errorResponse('Error al eliminar respuesta', 500, error));
  }
}
