// controllers/sugerencia.controller.ts
import { Request, Response } from 'express';
import { Sugerencia } from '../models/Sugerencia';
import { Comentario } from '../models/Comentario';
import { successResponse, errorResponse } from '../utils/apiResponse';

export async function createSugerencia(req: Request, res: Response) {
  try {
    const nueva = new Sugerencia(req.body);
    await nueva.save();
    res.status(201).json(successResponse('Sugerencia creada', nueva));
  } catch (error) {
    res.status(500).json(errorResponse('Error al crear sugerencia', 500, error));
  }
}

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

