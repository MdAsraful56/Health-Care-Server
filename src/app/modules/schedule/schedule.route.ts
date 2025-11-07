import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ScheduleController } from './schedule.controller';
import { ScheduleValidation } from './schedule.vaildition';

const router = express.Router();

router.post(
    '/create-schedule',
    auth(UserRole.ADMIN),
    validateRequest(ScheduleValidation.scheduleValidationSchema),
    ScheduleController.createSchedule
);

router.get(
    '/schedules-for-doctor',
    auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
    ScheduleController.schedulesForDoctor
);

router.delete('/delete-schedule/:id', ScheduleController.deleteSchedule);

export const scheduleRoutes = router;
