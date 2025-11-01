import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import { DoctorScheduleController } from './doctorSchedule.controller';

const router = express.Router();

router.post(
    '/create-doctor-schedule',
    auth(UserRole.DOCTOR),
    DoctorScheduleController.doctorScheduleCreate
);

export const doctorScheduleRoutes = router;
