import { Request, Response } from 'express';
import { authenticate } from '../services/auth.service';
import { User } from '../models/User';
import { successResponse, errorResponse } from '../utils/apiResponse';

export async function login(req: Request, res: Response) {
  const { usuario, password } = req.body;

  try {
    const user = await User.findOne({ usuario });

    if (!user) {
      res.status(401).json(errorResponse('Usuario o contraseña incorrectos', 401));
      return;
    }

    if (!user.estado) {
      res.status(403).json(errorResponse('Usuario inhabilitado', 403));
      return;
    }

    const result = await authenticate(usuario, password);

    res.status(200).json(successResponse('Inicio de sesión exitoso', result));
  } catch (error) {
    res.status(500).json(errorResponse('Error al iniciar sesión', 500, error));
  }
}


export async function register(req: Request, res: Response) {
  const { usuario, password, rol } = req.body;

  if (!usuario || !password || !rol) {
    res.status(400).json(errorResponse('Usuario, contraseña y rol son requeridos', 400));
    return;
  }

  try {
    const newUser = new User({ usuario, password, rol });
    await newUser.save();
    res.status(201).json(successResponse('Usuario registrado exitosamente'));
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json(errorResponse('El nombre de usuario ya existe', 400));
    } else {
      res.status(500).json(errorResponse('Error al registrar usuario', 500, error.message));
    }
  }
}
