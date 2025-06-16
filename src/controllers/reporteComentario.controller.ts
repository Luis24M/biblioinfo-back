// controllers/reporteComentario.controller.ts
import { Request, Response } from 'express';
import { ReporteComentario } from '../models/reporteComentario';
import { successResponse, errorResponse } from '../utils/apiResponse';

export async function createReporte(req: Request, res: Response) {
  try {
    const nuevo = new ReporteComentario(req.body);
    await nuevo.save();
    res.status(201).json(successResponse('Reporte creado', nuevo));
  } catch (error) {
    res.status(500).json(errorResponse('Error al crear reporte', 500, error));
  }
}

export async function getReportes(req: Request, res: Response) {
  try {
    const reportes = await ReporteComentario.find({ estado_reporte: true });
    res.status(200).json(successResponse('Reportes obtenidos', reportes));
  } catch (error) {
    res.status(500).json(errorResponse('Error al obtener reportes', 500, error));
  }
}

export async function updateReporte(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const actualizado = await ReporteComentario.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(successResponse('Reporte actualizado', actualizado));
  } catch (error) {
    res.status(500).json(errorResponse('Error al actualizar reporte', 500, error));
  }
}

export async function deleteReporte(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await ReporteComentario.findByIdAndUpdate(id, { estado_reporte: false });
    res.status(200).json(successResponse('Reporte eliminado lógicamente'));
  } catch (error) {
    res.status(500).json(errorResponse('Error al eliminar reporte', 500, error));
  }
}
