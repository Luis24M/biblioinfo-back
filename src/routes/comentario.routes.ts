import { Router } from 'express';
import {
  createComentario,
  getComentarios,
  updateComentario,
  deleteComentario
} from '../controllers/comentario.controller';

const router = Router();

router.post('/', createComentario);
router.get('/', getComentarios);
router.put('/:id', updateComentario);
router.delete('/:id', deleteComentario);

export default router;
