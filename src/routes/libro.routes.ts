import { Router } from 'express';
import {
  createLibro,
  getLibros,
  updateLibro,
  deleteLibro,
  getLibrosPorPersona,
  getLibrosMasComentados,
  getLibrosMasEstrellas,
  getUltimosLibros,
  getLibro
} from '../controllers/libro.controller';

const router = Router();

router.post('/', createLibro);
router.get('/', getLibros);
router.get('/persona/:id_persona', getLibrosPorPersona);
router.get('/ultimos', getUltimosLibros); 
router.get('/mas-comentados', getLibrosMasComentados);
router.get('/mas-estrellas', getLibrosMasEstrellas);
router.get('/libro/:id/id_persona/:id_persona?', getLibro);
router.put('/:id', updateLibro);
router.delete('/:id', deleteLibro);

export default router;
