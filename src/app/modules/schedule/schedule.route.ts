import express from 'express';
import { ScheduleController } from './schedule.controller';

const router = express.Router();

router.post('/create-schedule', ScheduleController.createSchedule);

export const scheduleRoutes = router;
