import express from 'express';
import { DoctorController } from './doctor.controller';

const router = express.Router();

router.get('/get-all-doctors', DoctorController.getAllDoctors);

router.patch('/update-doctor/:id', DoctorController.updateDoctor);

router.post('/suggestion', DoctorController.getAISuggestion);

export const DoctorRoutes = router;
