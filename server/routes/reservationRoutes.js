import express from 'express';
import { createReservation, getReservations, updateReservationStatus } from '../controllers/reservationController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createReservation);
router.get('/', auth, getReservations);
router.patch('/:id', auth, updateReservationStatus);

export default router;
