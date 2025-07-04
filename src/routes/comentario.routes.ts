import { Router } from 'express';
import {
  createComentario,
  getComentarios,
  getComentariosPorLibro,
  updateComentario,
  deleteComentario,
  getComentariosPorPersona
} from '../controllers/comentario.controller';

const router = Router();

router.post('/', createComentario);
router.get('/', getComentarios);
router.get('/persona/:id', getComentariosPorPersona);
router.get('/libro/:id', getComentariosPorLibro);
router.put('/:id', updateComentario);
router.delete('/:id', deleteComentario);

export default router;
