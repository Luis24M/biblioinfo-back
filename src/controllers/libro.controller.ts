import { Request, Response, RequestHandler } from 'express';
import { Libro } from '../models/Libro';
import { successResponse, errorResponse } from '../utils/apiResponse';

export const createLibro: RequestHandler = async (req, res) => {
  try {
    const data = req.body;

    // Función interna para validar campos requeridos
   

    // Si es un arreglo de libros
    if (Array.isArray(data)) {
      const librosValidados = data.map((libro) => {
        return new Libro({
          titulo: libro.titulo,
          autor: libro.autor,
          categoria: libro.categoria,
          anio: libro.anio,
          issbn: libro.issbn,
          sinopsis: libro.sinopsis,
          imagen_portada: libro.imagen_portada,
          ruta_libro: libro.ruta_libro,
          id_persona: libro.id_persona,
          fecha_libro: libro.fecha_libro,
          estado_libro: libro.estado_libro
        });
      });

      const librosGuardados = await Libro.insertMany(librosValidados);
      res.status(201).json(successResponse('Libros creados exitosamente', librosGuardados));
    } else {
      // Si es un solo libro

      const nuevoLibro = new Libro({
        titulo: data.titulo,
        autor: data.autor,
        categoria: data.categoria,
        anio: data.anio,
        issbn: data.issbn,
        sinopsis: data.sinopsis,
        imagen_portada: data.imagen_portada,
        ruta_libro: data.ruta_libro,
        id_persona: data.id_persona,
        fecha_libro: data.fecha_libro,
        estado_libro: data.estado_libro
      });

      const libroGuardado = await nuevoLibro.save();
      res.status(201).json(successResponse('Libro creado exitosamente', libroGuardado));
    }
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message || 'Error al crear libro', 500, error));
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
