import { Request,Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Persona } from '../models/Persona';

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
    id_user,
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
    const personaExistente = await Persona.findOne({ id_user });
    if (personaExistente) {
      res.status(400).json({ message: 'Ya existe una persona asociada a ese usuario' });
      return;
    }

    const nuevaPersona = new Persona({
      id_user,
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
