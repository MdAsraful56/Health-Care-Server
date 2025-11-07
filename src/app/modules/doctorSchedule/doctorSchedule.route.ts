import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { DoctorScheduleController } from './doctorSchedule.controller';
import { DoctorScheduleValidation } from './doctorSchedule.validation';

const router = express.Router();

router.post(
    '/create-doctor-schedule',
    auth(UserRole.DOCTOR, UserRole.ADMIN),
    validateRequest(
        DoctorScheduleValidation.createDoctorScheduleValidationSchema
    ),
    DoctorScheduleController.doctorScheduleCreate
);

router.get(
    '/get-all-doctor-schedules',
    auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
    DoctorScheduleController.GetAllDoctorSchedules
);

router.get(
    '/my-schedule',
    auth(UserRole.DOCTOR),
    DoctorScheduleController.getMySchedule
);

router.delete(
    '/delete-doctor-schedule/:id',
    auth(UserRole.DOCTOR),
    DoctorScheduleController.DeleteDoctorSchedule
);

export const doctorScheduleRoutes = router;
