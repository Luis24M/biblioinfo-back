import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export async function authenticate(usuario: string, password: string) {
  const user = await User.findOne({ usuario });
  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Credenciales inválidas');
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '4h' });
  return { token, userId: user._id, rol: user.rol };
}
