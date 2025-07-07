import { Request, Response } from 'express';
import { Persona } from '../models/Persona';
import { User } from '../models/User';
import { Libro } from '../models/Libro';
import { successResponse, errorResponse } from '../utils/apiResponse';
import { Types } from 'mongoose';

export async function getPersonaByUserId(req: Request, res: Response): Promise<void> {
  const userId = req.params.userId;

  try {
    const persona = await Persona.findOne({ id_user: userId });

    if (!persona) {
      res.status(404).json(errorResponse('Persona no encontrada', 404));
      return;
    }

    const user = await User.findById(userId);
    const rol = user?.rol || 'rol no encontrado';

    res.status(200).json(
      successResponse('Persona encontrada', {
        persona,
        rol
      })
    );
  } catch (error) {
    res.status(500).json(errorResponse('Error al obtener persona', 500, error));
  }
}


export async function createPersona(req: Request, res: Response): Promise<void> {
  const {
    codigoEstudiante,
    nombres,
    apellidos,
    correo,
    carrera,
  } = req.body;

  try {
    let user = await User.findOne({ usuario: codigoEstudiante });

    if (!user) {
      const newUser = new User({
        usuario: codigoEstudiante,
        password: codigoEstudiante,
        rol: 'estudiante' // si no envían rol, asigna 'estudiante' por defecto
      });
      user = await newUser.save();
    }

    const id_user = user._id;

    const personaExistente = await Persona.findOne({
      $or: [{ id_user }, { codigoEstudiante }]
    });

    if (personaExistente) {
      res.status(400).json(errorResponse('Ya existe una persona con ese usuario o código', 400));
      return;
    }

    const nuevaPersona = new Persona({
      id_user,
      codigoEstudiante,
      nombres,
      apellidos,
      correo,
      carrera,
    });

    await nuevaPersona.save();

    res.status(201).json(successResponse('Persona creada exitosamente', {
      persona: nuevaPersona,
      rol: user.rol
    }));
  } catch (error) {
    res.status(500).json(errorResponse('Error al crear la persona', 500, error));
  }
}


export async function updatePersona(req: Request, res: Response): Promise<void> {
  const id = req.params.personaId;
  const {
    nombres,
    apellidos,
    correo,
    carrera,
    biografia,
    rol="estudiante",
    estado
  } = req.body;

  try {
    const persona = await Persona.findById(id);
    if (!persona) {
      res.status(404).json(errorResponse('Persona no encontrada', 404));
      return;
    }

    // Actualizar rol y estado en el usuario
    if (rol || estado !== undefined) {
      await User.findByIdAndUpdate(persona.id_user, {
        ...(rol && { rol }),
        ...(estado !== undefined && { estado })
      });
    }

    // Actualizar estado en Persona si fue enviado
    const camposActualizarPersona: any = {
      ...(nombres && { nombres }),
      ...(apellidos && { apellidos }),
      ...(correo && { correo }),
      ...(carrera && { carrera }),
      ...(biografia && { biografia }),
      ...(estado !== undefined && { estado })
    };

    const personaActualizada = await Persona.findByIdAndUpdate(
      id,
      camposActualizarPersona,
      { new: true }
    );

    const userActualizado = await User.findById(persona.id_user);

    res.status(200).json(
      successResponse('Persona, rol y estado actualizados exitosamente', {
        persona: personaActualizada,
        rol: userActualizado?.rol,
        estado: userActualizado?.estado
      })
    );
  } catch (error) {
    res.status(500).json(errorResponse('Error al actualizar la persona', 500, error));
  }
}

export async function getAllPersonas(req: Request, res: Response): Promise<void> {
  try {
    const personas = await Persona.find().lean();

    const personasConUsuario = await Promise.all(personas.map(async (persona) => {
      const user = await User.findById(persona.id_user).lean();
      return {
        ...persona,
        rol: user?.rol || 'desconocido',
        estado: user?.estado
      };
    }));

    res.status(200).json(successResponse('Personas encontradas', personasConUsuario));
  } catch (error) {
    res.status(500).json(errorResponse('Error al obtener personas', 500, error));
  }
}

export async function guardarLibroEnPersona(req: Request, res: Response): Promise<void> {
  const { id_persona, id_libro } = req.body;

  try {
    const persona = await Persona.findById(id_persona);
    if (!persona) {
      res.status(404).json(errorResponse('Persona no encontrada', 404));
      return;
    }

    const libro = await Libro.findById(id_libro);
    if (!libro) {
      res.status(404).json(errorResponse('Libro no encontrado', 404));
      return;
    }

    // Comparación segura de strings
    const libroIdStr = id_libro.toString();
    const yaGuardado = persona.librosGuardados.some(
      (libroGuardadoId) => libroGuardadoId.toString() === libroIdStr
    );

    if (yaGuardado) {
      res.status(400).json(errorResponse('El libro ya está guardado', 400));
      return;
    }

    persona.librosGuardados.push(id_libro); // puede ser string, Mongoose lo convierte
    await persona.save();

    res.status(200).json(successResponse('Libro guardado correctamente', persona));
  } catch (error) {
    res.status(500).json(errorResponse('Error al guardar el libro', 500, error));
  }
}


export async function getLibrosGuardadosPorPersona(req: Request, res: Response): Promise<void> {
  const { id_persona } = req.params;

  try {
    const persona = await Persona.findById(id_persona)
      .populate({
        path: 'librosGuardados',
        match: { estado_libro: true, estado_revision: 'aprobada' },
        populate: {
          path: 'id_persona', // la persona que subió el libro
          model: 'Persona',
          select: 'nombres apellidos correo carrera'
        }
      });

    if (!persona) {
      res.status(404).json(errorResponse('Persona no encontrada', 404));
      return;
    }

    // Aquí puedes controlar qué campos mostrar del libro si quisieras
    const librosGuardados = persona.librosGuardados;

    res.status(200).json(successResponse('Libros guardados obtenidos correctamente', librosGuardados));
  } catch (error) {
    res.status(500).json(errorResponse('Error al obtener libros guardados', 500, error));
  }
}

export async function eliminarLibroGuardado(req: Request, res: Response): Promise<void> {
  const { id_persona, id_libro } = req.body;

  try {
    const persona = await Persona.findById(id_persona);
    if (!persona) {
      res.status(404).json(errorResponse('Persona no encontrada', 404));
      return;
    }

    // Verifica si el libro está guardado
    const index = persona.librosGuardados.indexOf(id_libro);
    if (index === -1) {
      res.status(400).json(errorResponse('El libro no está en la lista de guardados', 400));
      return;
    }

    // Quitar el libro
    persona.librosGuardados.splice(index, 1);
    await persona.save();

    res.status(200).json(successResponse('Libro eliminado de la lista de guardados', persona));
  } catch (error) {
    res.status(500).json(errorResponse('Error al eliminar libro guardado', 500, error));
  }
}



export async function fixEstadoRevisionLibrosFaltantes(): Promise<void> {
  try {
    const result = await Libro.updateMany(
      { estado_revision: { $exists: false } },
      { $set: { estado_revision: 'aprobado' } }
    );

    console.log(`${result.modifiedCount} libros actualizados con estado_revision: 'aprobado'`);
  } catch (error) {
    console.error('Error al actualizar libros:', error);
  }
}


