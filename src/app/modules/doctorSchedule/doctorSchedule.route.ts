import express from 'express';
import { DoctorScheduleController } from './doctorSchedule.controller';

const router = express.Router();

router.post(
    '/create-doctor-schedule',
    // auth(UserRole.DOCTOR, UserRole.ADMIN, UserRole.PATIENT),
    DoctorScheduleController.doctorScheduleCreate
);

export const doctorScheduleRoutes = router;
