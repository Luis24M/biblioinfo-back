import { Request, Response, RequestHandler } from 'express';
import { Libro } from '../models/Libro';
import { successResponse, errorResponse } from '../utils/apiResponse';

export const createLibro: RequestHandler = async (req, res) => {
  try {
    const data = req.body;

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
          estado_libro: libro.estado_libro,
          estado_revision: 'pendiente' // NUEVO
        });
      });

      const librosGuardados = await Libro.insertMany(librosValidados);
      res.status(201).json(successResponse('Libros creados exitosamente', librosGuardados));
    } else {
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
        estado_libro: data.estado_libro,
        estado_revision: 'pendiente' // NUEVO
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
    const libros = await Libro.find({
      estado_libro: true,
      estado_revision: 'aprobado'
    })
      .populate('id_persona')
      .populate('comentarios');

    res.status(200).json(successResponse('Libros obtenidos', libros));
  } catch (error) {
    res.status(500).json(errorResponse('Error al obtener libros', 500, error));
  }
}


// ultimos 3 libros
export async function getUltimosLibros(req: Request, res: Response) {
  try {
    const libros = await Libro.find({ estado_libro: true }).sort({ fecha_libro: -1 }).limit(3).populate('comentarios');
    res.status(200).json(successResponse('Libros obtenidos', libros));
  } catch (error) {
    res.status(500).json(errorResponse('Error al obtener libros', 500, error));
  }
}

// 3 libros mas comentados
export async function getLibrosMasComentados(req: Request, res: Response) {
  try {
    const libros = await Libro.find({ estado_libro: true }).sort({ comentarios: -1 }).limit(3).populate('comentarios');
    res.status(200).json(successResponse('Libros obtenidos', libros));
  } catch (error) {
    res.status(500).json(errorResponse('Error al obtener libros', 500, error));
  }
}

// 3 libros con mas estrellas
export async function getLibrosMasEstrellas(req: Request, res: Response) {
  try {
    const libros = await Libro.find({ estado_libro: true }).sort({ estrellas: -1 }).limit(3).populate('comentarios');
    res.status(200).json(successResponse('Libros obtenidos', libros));
  } catch (error) {
    res.status(500).json(errorResponse('Error al obtener libros', 500, error));
  }
}

export async function getLibro(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Validar que el ID sea válido
    if (!id) {
      res.status(400).json(errorResponse('ID de libro no válido', 400));
    }
    // nombres: { type: String, required: true },
    //   apellidos: { type: String, required: true },
    //   correo: { type: String, required: true },
    //   carrera: { type: String, required: true },
    // Buscar el libro y poblar los comentarios y la persona asociada
    const libro = await Libro.findById(id)
      .populate({
        path: 'comentarios', // Poblar el array de comentarios
        match: { estado_comentario: true }, // Solo comentarios activos
        populate: {
          path: 'id_persona', // Poblar id_persona dentro de cada comentario
          model: 'Persona',
          select: 'nombres apellidos correo carrera' // Seleccionar solo el campo nombre (ajusta según tu modelo)
        }
      });

    if (!libro) {
      res.status(404).json(errorResponse('Libro no encontrado', 404));
    }

    res.status(200).json(successResponse('Libro obtenido', libro));
  } catch (error) {
    res.status(500).json(errorResponse('Error al obtener libro', 500, error));
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
