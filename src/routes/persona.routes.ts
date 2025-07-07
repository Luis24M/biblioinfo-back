import { Router } from 'express';
import {
  getAllPersonas,
  updatePersona,
  createPersona,
  getPersonaByUserId,
  guardarLibroEnPersona,
  getLibrosGuardadosPorPersona,
  eliminarLibroGuardado,
  setEstadoRevisionAprobadoTodos,
  desactivarPersona 
} from '../controllers/persona.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// Información general de la persona
router.get('/user/:userId', verifyToken, getPersonaByUserId);
router.post('/register', verifyToken, createPersona);
router.put('/update/:personaId', verifyToken, updatePersona);
router.get('/allpersonas', verifyToken, getAllPersonas);

// ✅ Libros guardados
router.post('/guardar-libro', verifyToken, guardarLibroEnPersona);
router.get('/:id_persona/libros-guardados', verifyToken, getLibrosGuardadosPorPersona);
router.post('/eliminar-libro-guardado', verifyToken, eliminarLibroGuardado);
router.put('/:id/desactivar', desactivarPersona);


router.post('/fix-revision', setEstadoRevisionAprobadoTodos)

export default router;
