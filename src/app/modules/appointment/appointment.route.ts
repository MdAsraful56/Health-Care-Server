import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import { AppointmentController } from './appointment.controller';

const router = express.Router();

router.post(
    '/create-appointment',
    auth(UserRole.PATIENT),
    AppointmentController.CreateAppointment
);

router.get(
    '/get-my-appointments',
    auth(UserRole.PATIENT, UserRole.DOCTOR),
    AppointmentController.GetMyAppointments
);

router.get('/get-appointment/:id', (req, res) => {
    // Handle fetching a specific appointment
});

router.put('/update-appointment/:id', (req, res) => {
    // Handle updating a specific appointment
});

router.delete('/delete-appointment/:id', (req, res) => {
    // Handle deleting a specific appointment
});

export const appointmentRouter = router;
