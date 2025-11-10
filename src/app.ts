import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import cron from 'node-cron';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import { AppointmentService } from './app/modules/appointment/appointment.service';
import { PaymentController } from './app/modules/payment/payment.controller';
import router from './app/routes';

const app: Application = express();

app.post(
    '/api/v1/payment/webhook',
    express.raw({ type: 'application/json' }),
    PaymentController.handleStripeWebhookEvent
);

app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
);

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

cron.schedule('* * * * *', () => {
    try {
        console.log('Node cron called at ', new Date());
        AppointmentService.cancelUnpaidAppointments();
    } catch (err) {
        console.error(err);
    }
});

app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
    res.send({
        Message: 'Health Care Server..',
        RunningTime: process.uptime().toFixed(2) + ' seconds',
        Time: new Date().toLocaleTimeString(),
    });
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
