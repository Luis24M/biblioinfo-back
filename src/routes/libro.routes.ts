import { Router } from 'express';
import {
  createLibro,
  getLibros,
  updateLibro,
  deleteLibro,
  getLibrosPorPersona,
  getLibrosMasComentados,
  getLibrosMasEstrellas,
  getUltimosLibros
} from '../controllers/libro.controller';

const router = Router();

router.post('/', createLibro);
router.get('/', getLibros);
router.get('/persona/:id_persona', getLibrosPorPersona);
router.get('/ultimos', getUltimosLibros); 
router.get('/mas-comentados', getLibrosMasComentados);
router.get('/mas-estrellas', getLibrosMasEstrellas);
router.put('/:id', updateLibro);
router.delete('/:id', deleteLibro);

export default router;
