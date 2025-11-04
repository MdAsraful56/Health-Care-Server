import express from 'express';
import { adminRouters } from '../modules/admin/admin.route';
import { appointmentRouter } from '../modules/appointment/appointment.route';
import { authRoutes } from '../modules/auth/auth.routes';
import { DoctorRoutes } from '../modules/doctor/doctor.route';
import { doctorScheduleRoutes } from '../modules/doctorSchedule/doctorSchedule.route';
import { PaymentRoute } from '../modules/payment/payment.route';
import { scheduleRoutes } from '../modules/schedule/schedule.route';
import { SpecialtiesRoutes } from '../modules/specialties/specialties.route';
import { userRoutes } from '../modules/user/user.route';

const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: userRoutes,
    },
    {
        path: '/admin',
        route: adminRouters,
    },
    {
        path: '/doctor',
        route: DoctorRoutes,
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
    {
        path: '/specialties',
        route: SpecialtiesRoutes,
    },

    {
        path: '/appointments',
        route: appointmentRouter,
    },
    {
        path: '/payment',
        route: PaymentRoute,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
