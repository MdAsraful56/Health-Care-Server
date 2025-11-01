import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import { ScheduleController } from './schedule.controller';

const router = express.Router();

router.post('/create-schedule', ScheduleController.createSchedule);
router.get(
    '/schedules-for-doctor',
    auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
    ScheduleController.schedulesForDoctor
);

router.delete('/delete-schedule/:id', ScheduleController.deleteSchedule);

export const scheduleRoutes = router;
