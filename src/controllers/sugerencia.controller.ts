// controllers/sugerencia.controller.ts
import { Request, Response, RequestHandler } from 'express';
import { Sugerencia } from '../models/Sugerencia';
import { Libro } from '../models/Libro';
import { successResponse, errorResponse } from '../utils/apiResponse';

export const createSugerencia: RequestHandler = async (req, res) => {
  try {
    const { libro, comentario_inicial, id_persona } = req.body;

    if (!libro || !comentario_inicial || !id_persona) {
      res
        .status(400)
        .json(errorResponse('Faltan datos requeridos', 400));
      return;
    }

    // 1. Crear el libro
    const nuevoLibro = new Libro({ ...libro, id_persona });
    await nuevoLibro.save();

    // 2. Crear la sugerencia con el libro creado
    const nuevaSugerencia = new Sugerencia({
      id_libro: nuevoLibro._id,
      comentario_inicial,
      id_persona,
    });
    await nuevaSugerencia.save();

    res.status(201).json(
      successResponse('Sugerencia creada con libro incluido', {
        libro: nuevoLibro,
        sugerencia: nuevaSugerencia,
      })
    );
  } catch (error) {
    res
      .status(500)
      .json(errorResponse('Error al crear sugerencia con libro', 500, error));
  }
};
export async function getSugerencias(req: Request, res: Response) {
  try {
    const sugerencias = await Sugerencia.find({ estado_sugerencia: true });
    res.status(200).json(successResponse('Sugerencias obtenidas', sugerencias));
  } catch (error) {
    res.status(500).json(errorResponse('Error al obtener sugerencias', 500, error));
  }
}

export async function updateSugerencia(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const actualizada = await Sugerencia.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(successResponse('Sugerencia actualizada', actualizada));
  } catch (error) {
    res.status(500).json(errorResponse('Error al actualizar sugerencia', 500, error));
  }
}

export async function deleteSugerencia(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await Sugerencia.findByIdAndUpdate(id, { estado_sugerencia: false });
    res.status(200).json(successResponse('Sugerencia eliminada lógicamente'));
  } catch (error) {
    res.status(500).json(errorResponse('Error al eliminar sugerencia', 500, error));
  }
}

export async function getSugerenciaCompleta(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const sugerencia = await Sugerencia.findOne({ _id: id, estado_sugerencia: true })
      .populate('id_libro')
      .populate('id_persona')
      .populate({
        path: 'id_comentario',
        match: { estado_comentario: true }, // Solo comentarios activos
        populate: { path: 'id_persona' }   // Traer datos de quien comentó
      });

    if (!sugerencia) {
      res.status(404).json(errorResponse('Sugerencia no encontrada o inactiva', 404));
      return;
    }

    res.status(200).json(successResponse('Sugerencia completa encontrada', sugerencia));
  } catch (error) {
    res.status(500).json(errorResponse('Error al obtener sugerencia completa', 500, error));
  }
}
