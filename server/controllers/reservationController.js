import Reservation from '../models/Reservation.js';

export const createReservation = async (req, res) => {
    try {
        const newReservation = await Reservation.create(req.body);
        res.status(201).json(newReservation);
    } catch (error) {
        res.status(500).json({ message: "Error creating reservation" });
    }
};

export const getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find().sort({ date: 1 });
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reservations" });
    }
};

export const updateReservationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedReservation = await Reservation.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json(updatedReservation);
    } catch (error) {
        res.status(500).json({ message: "Error updating reservation" });
    }
};
