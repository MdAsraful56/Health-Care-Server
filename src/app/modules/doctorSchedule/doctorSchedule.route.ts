import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { DoctorScheduleController } from './doctorSchedule.controller';
import { DoctorScheduleValidation } from './doctorSchedule.validation';

const router = express.Router();

router.post(
    '/create-doctor-schedule',
    // auth(UserRole.DOCTOR, UserRole.ADMIN, UserRole.PATIENT),
    validateRequest(
        DoctorScheduleValidation.createDoctorScheduleValidationSchema
    ),
    DoctorScheduleController.doctorScheduleCreate
);

export const doctorScheduleRoutes = router;
