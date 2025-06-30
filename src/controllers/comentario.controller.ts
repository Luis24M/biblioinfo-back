// controllers/comentario.controller.ts
import { Request, Response } from 'express';
import { Comentario } from '../models/Comentario';
import { successResponse, errorResponse } from '../utils/apiResponse';
import { Libro } from '../models/Libro';

export async function createComentario(req: Request, res: Response) {
  try {
    const { id_libro, id_persona, contenido_comentario, cantidad_estrellas_comentario } = req.body;

    // Validar que los campos requeridos estén presentes
    if (!id_libro || !id_persona || !contenido_comentario || !cantidad_estrellas_comentario) {
      res.status(400).json(errorResponse('Faltan campos requeridos', 400));
    }

    // Validar que el ID del libro sea válido
    if (!id_libro) {
      res.status(400).json(errorResponse('ID de libro no válido', 400));
    }

    // Crear el comentario
    const nuevo = new Comentario({
      id_libro,
      id_persona,
      contenido_comentario,
      cantidad_estrellas_comentario,
    });

    // Guardar el comentario
    await nuevo.save();

    // Obtener todos los comentarios activos del libro (incluyendo el nuevo)
    const comentarios = await Comentario.find({ id_libro, estado_comentario: true });

    // Calcular el promedio de estrellas
    const totalEstrellas = comentarios.reduce((sum, comentario) => sum + comentario.cantidad_estrellas_comentario, 0);
    const promedioEstrellas = comentarios.length > 0 ? totalEstrellas / comentarios.length : 0;

    // Actualizar el libro para añadir el ID del comentario y el promedio de estrellas
    const libroActualizado = await Libro.findByIdAndUpdate(
      id_libro,
      { 
        $push: { comentarios: nuevo._id },
        $set: { estrellas: promedioEstrellas }
      },
      { new: true }
    );

    // Verificar si el libro existe
    if (!libroActualizado) {
      // Eliminar el comentario si el libro no existe para mantener consistencia
      await Comentario.findByIdAndDelete(nuevo._id);
      res.status(404).json(errorResponse('Libro no encontrado', 404));
    }

    res.status(201).json(successResponse('Comentario creado', nuevo));
  } catch (error) {
    res.status(500).json(errorResponse('Error al crear comentario', 500, error));
  }
}

export async function getComentarios(req: Request, res: Response) {
  try {
    const comentarios = await Comentario.find({ estado_comentario: true });
    res.status(200).json(successResponse('Comentarios obtenidos', comentarios));
  } catch (error) {
    res.status(500).json(errorResponse('Error al obtener comentarios', 500, error));
  }
}

export async function getComentariosPorLibro(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const comentarios = await Comentario.find({ id_libro: id, estado_comentario: true }).populate('id_persona');
    res.status(200).json(successResponse('Comentarios obtenidos', comentarios));
  } catch (error) {
    res.status(500).json(errorResponse('Error al obtener comentarios por libro', 500, error));
  }
}

export async function updateComentario(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const actualizado = await Comentario.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(successResponse('Comentario actualizado', actualizado));
  } catch (error) {
    res.status(500).json(errorResponse('Error al actualizar comentario', 500, error));
  }
}

export async function deleteComentario(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await Comentario.findByIdAndUpdate(id, { estado_comentario: false });
    res.status(200).json(successResponse('Comentario eliminado lógicamente'));
  } catch (error) {
    res.status(500).json(errorResponse('Error al eliminar comentario', 500, error));
  }
}


