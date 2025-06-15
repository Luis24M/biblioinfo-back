import { Router } from 'express';
import { getAllPersonas, updatePersona, createPersona, getPersonaByUserId } from '../controllers/persona.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/user/:userId', verifyToken, getPersonaByUserId);
router.post('/register', verifyToken, createPersona);
router.put('/update/:personaId', verifyToken, updatePersona);
router.get('/allpersonas', verifyToken, getAllPersonas); // Ruta protegida

export default router;
