import { Router } from 'express';
import {
  createSugerencia,
  getSugerencias,
  updateSugerencia,
  deleteSugerencia,
  getSugerenciaCompleta
} from '../controllers/sugerencia.controller';

const router = Router();

router.post('/', createSugerencia);
router.get('/', getSugerencias);
router.put('/:id', updateSugerencia);
router.delete('/:id', deleteSugerencia);
router.get('/sugerencias/:id/completa', getSugerenciaCompleta);


export default router;
