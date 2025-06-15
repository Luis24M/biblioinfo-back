import { Request, Response } from 'express';
import { authenticate } from '../services/auth.service';
import { User } from '../models/User';


export async function login(req: Request, res: Response) {
  const { usuario, password } = req.body;
  try {
    const result = await authenticate(usuario, password);
    res.json(result);
  } catch {
    res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
  }
}


export async function register(req: Request, res: Response){
  const { usuario, password, rol } = req.body;
  if (!usuario || !password || !rol) {
      res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
    }
  try {
    const newUser = new User({ usuario, password, rol });
    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'El nombre de usuario ya existe' });
    } else {
      res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
    }
  }
}
