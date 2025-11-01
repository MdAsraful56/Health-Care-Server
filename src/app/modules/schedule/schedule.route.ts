import express from 'express';
import { ScheduleController } from './schedule.controller';

const router = express.Router();

router.post('/create-schedule', ScheduleController.createSchedule);
router.get('/schedules-for-doctor', ScheduleController.schedulesForDoctor);

export const scheduleRoutes = router;
