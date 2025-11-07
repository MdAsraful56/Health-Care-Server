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

router.patch(
    '/appointment-status/:id',
    auth(UserRole.ADMIN, UserRole.DOCTOR),
    AppointmentController.UpdateAppointmentStatus
);

export const appointmentRouter = router;
