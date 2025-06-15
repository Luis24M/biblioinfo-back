import { Router } from 'express';
import { createPersona, getPersonaByUserId } from '../controllers/persona.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/me', verifyToken, getPersonaByUserId); // /persona/me
router.post('/register', createPersona);

export default router;
