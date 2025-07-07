// controllers/sugerencia.controller.ts
import { Request, Response, RequestHandler } from 'express';
import { Sugerencia } from '../models/Sugerencia';
import { Libro } from '../models/Libro';
import { successResponse, errorResponse } from '../utils/apiResponse';

export const createSugerencia: RequestHandler = async (req, res) => {
  try {
    const { libro, comentario_inicial, id_persona, estado_revision } = req.body;

    if (!libro || !id_persona) {
      res.status(400).json(errorResponse('Faltan datos requeridos: libro o id_persona', 400));
      return;
    }

    // 1. Crear el libro con estado_revision: 'pendiente'
    const nuevoLibro = new Libro({
      titulo: libro.titulo,
      autor: libro.autor,
      categoria: libro.categoria,
      anio: libro.anio,
      issbn: libro.issbn,
      sinopsis: libro.sinopsis,
      imagen_portada: libro.imagen_portada,
      ruta_libro: libro.ruta_libro,
      id_persona: id_persona,
      fecha_libro: libro.fecha_libro || Date.now(),
      estado_libro: libro.estado_libro ?? true,
      estado_revision: 'pendiente' // Forzamos esto porque es para revisión
    });

    await nuevoLibro.save();

    // 2. Crear la sugerencia asociada
    const nuevaSugerencia = new Sugerencia({
      id_libro: nuevoLibro._id,
      id_persona: id_persona,
      comentario_inicial: comentario_inicial || '',
      estado_revision: estado_revision || 'pendiente' // ← Nuevo campo, opcional en req.body
      // estado_sugerencia, id_comentario y fecha_sugerencia se manejan por defecto
    });

    await nuevaSugerencia.save();

    res.status(201).json(
      successResponse('Sugerencia creada con libro incluido', {
        libro: nuevoLibro,
        sugerencia: nuevaSugerencia
      })
    );
  } catch (error) {
    res.status(500).json(errorResponse('Error al crear sugerencia con libro', 500, error));
  }
};

export async function getSugerencias(req: Request, res: Response) {
  try {
    const sugerencias = await Sugerencia.find(); // sin filtros

    res.status(200).json(successResponse('Todas las sugerencias obtenidas', sugerencias));
  } catch (error) {
    res.status(500).json(errorResponse('Error al obtener sugerencias', 500, error));
  }
}



export async function updateSugerencia(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { estado_revision } = req.body;

    // 1. Actualizar sugerencia
    const sugerenciaActualizada = await Sugerencia.findByIdAndUpdate(id, req.body, { new: true });

    if (!sugerenciaActualizada) {
      res.status(404).json(errorResponse('Sugerencia no encontrada', 404));
      return;
    }

    // 2. Si se manda estado_revision como 'aprobada' o 'rechazada', actualizar el libro también
    if (estado_revision === 'aprobada' || estado_revision === 'rechazada') {
      await Libro.findByIdAndUpdate(sugerenciaActualizada.id_libro, {
        estado_revision: estado_revision
      });
    }

    res.status(200).json(successResponse('Sugerencia actualizada', sugerenciaActualizada));
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
