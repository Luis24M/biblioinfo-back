import { Router } from 'express';
import {
  createLibro,
  getLibros,
  updateLibro,
  deleteLibro,
  getLibrosPorPersona
} from '../controllers/libro.controller';

const router = Router();

router.post('/', createLibro);
router.get('/', getLibros);
router.get('/persona/:id_persona', getLibrosPorPersona); // Libros por persona
router.put('/:id', updateLibro);
router.delete('/:id', deleteLibro);

export default router;
