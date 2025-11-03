import express from 'express';
import { DoctorController } from './doctor.controller';

const router = express.Router();

router.get('/get-all-doctors', DoctorController.getAllDoctors);

export const DoctorRoutes = router;
