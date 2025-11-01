import express from 'express';
import { authRoutes } from '../modules/auth/auth.routes';
import { doctorScheduleRoutes } from '../modules/doctorSchedule/doctorSchedule.route';
import { scheduleRoutes } from '../modules/schedule/schedule.route';
import { userRoutes } from '../modules/user/user.route';

const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: userRoutes,
    },
    {
        path: '/auth',
        route: authRoutes,
    },
    {
        path: '/schedule',
        route: scheduleRoutes,
    },
    {
        path: '/doctor-schedule',
        route: doctorScheduleRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
