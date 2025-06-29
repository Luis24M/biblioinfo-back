// controllers/comentario.controller.ts
import { Request, Response } from 'express';
import { Comentario } from '../models/Comentario';
import { successResponse, errorResponse } from '../utils/apiResponse';

export async function createComentario(req: Request, res: Response) {
  try {
    const nuevo = new Comentario(req.body);
    await nuevo.save();
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
    const comentarios = await Comentario.find({ id_libro: id, estado_comentario: true });
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


