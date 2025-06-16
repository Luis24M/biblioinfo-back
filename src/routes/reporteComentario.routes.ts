import { Router } from 'express';
import {
  createReporte,
  getReportes,
  updateReporte,
  deleteReporte
} from '../controllers/reporteComentario.controller';

const router = Router();

router.post('/', createReporte);
router.get('/', getReportes);
router.put('/:id', updateReporte);
router.delete('/:id', deleteReporte);

export default router;
