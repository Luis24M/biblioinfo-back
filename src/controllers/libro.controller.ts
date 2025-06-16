import { Request, Response, RequestHandler } from 'express';
import { Libro } from '../models/Libro';
import { successResponse, errorResponse } from '../utils/apiResponse';

export const createLibro: RequestHandler = async (req, res) => {
  try {
    const {
      titulo,
      autor,
      categoria,
      año,
      issbn,
      sinopsis,
      imagen_portada,
      ruta_libro,
      id_persona
    } = req.body;

    if (!id_persona) {
      res.status(400).json(errorResponse('El campo id_persona es requerido', 400));
      return;
    }

    const nuevoLibro = new Libro({
      titulo,
      autor,
      categoria,
      año,
      issbn,
      sinopsis,
      imagen_portada,
      ruta_libro,
      id_persona
    });

    await nuevoLibro.save();

    res.status(201).json(successResponse('Libro creado exitosamente', nuevoLibro));
  } catch (error) {
    res.status(500).json(errorResponse('Error al crear libro', 500, error));
  }
};

export async function getLibros(req: Request, res: Response) {
  try {
    const libros = await Libro.find({ estado_libro: true }).populate('id_persona');
    res.status(200).json(successResponse('Libros obtenidos', libros));
  } catch (error) {
    res.status(500).json(errorResponse('Error al obtener libros', 500, error));
  }
}

export async function updateLibro(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const libroActualizado = await Libro.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(successResponse('Libro actualizado', libroActualizado));
  } catch (error) {
    res.status(500).json(errorResponse('Error al actualizar libro', 500, error));
  }
}

export async function deleteLibro(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await Libro.findByIdAndUpdate(id, { estado_libro: false });
    res.status(200).json(successResponse('Libro eliminado lógicamente'));
  } catch (error) {
    res.status(500).json(errorResponse('Error al eliminar libro', 500, error));
  }
}


export async function getLibrosPorPersona(req: Request, res: Response) {
  try {
    const { id_persona } = req.params;
    const libros = await Libro.find({ id_persona, estado_libro: true }).populate('id_persona');
    res.status(200).json(successResponse('Libros obtenidos para la persona', libros));
  } catch (error) {
    res.status(500).json(errorResponse('Error al obtener libros por persona', 500, error));
  }
}
