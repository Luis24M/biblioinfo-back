import { Request,Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Persona } from '../models/Persona';
import { User } from '../models/User';


export async function getPersonaByUserId(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId;

  try {
    const persona = await Persona.findOne({ id_user: userId });
    if (!persona) {
      res.status(404).json({ message: 'Persona no encontrada' });
      return;
    }
    res.json(persona); // no uses "return" aquí
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener persona' });
  }
}

export async function createPersona(req: Request, res: Response): Promise<void> {
  const {
    codigoEstudiante,
    nombres,
    apellidos,
    correo,
    carrera,
    biografia,
    librosGuardados,
    librosSugeridos,
    resenasUtiles
  } = req.body;

  try {
    // Buscar usuario por códigoEstudiante, que se guarda como 'usuario'
    const user = await User.findOne({ usuario: codigoEstudiante });
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    const id_user = user._id;

    // Verificar si ya hay una persona con ese id_user o con ese código
    const personaExistente = await Persona.findOne({ 
      $or: [{ id_user }, { codigoEstudiante }]
    });

    if (personaExistente) {
      res.status(400).json({ message: 'Ya existe una persona con ese usuario o código' });
      return;
    }

    const nuevaPersona = new Persona({
      id_user,
      codigoEstudiante, // ahora lo guardamos correctamente
      nombres,
      apellidos,
      correo,
      carrera,
      biografia,
      librosGuardados,
      librosSugeridos,
      resenasUtiles
    });

    await nuevaPersona.save();
    res.status(201).json({ message: 'Persona creada exitosamente', persona: nuevaPersona });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la persona', error });
  }
}

