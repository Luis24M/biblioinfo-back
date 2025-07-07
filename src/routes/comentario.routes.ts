import { Router } from 'express';
import {
  createComentario,
  getComentarios,
  getComentariosPorLibro,
  updateComentario,
  deleteComentario,
  getComentariosPorPersona,
  addReply,
  deleteReply
} from '../controllers/comentario.controller';

const router = Router();

router.post('/', createComentario);
router.get('/', getComentarios);
router.get('/persona/:id', getComentariosPorPersona);
router.get('/libro/:id', getComentariosPorLibro);
router.put('/:id', updateComentario);
router.delete('/:id', deleteComentario);
router.post('/reply/:id', addReply);

// ✅ Esta es la ruta que lanza error: asegúrate de que los nombres estén bien y exportes deleteReply como función
// router.put('/respuesta/:idComentario/:idRespuesta/eliminar', deleteReply);

export default router;
