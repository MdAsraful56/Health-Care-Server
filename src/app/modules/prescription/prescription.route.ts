import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import { PrescriptionController } from './prescription.controller';

const router = express.Router();

router.post(
    '/create-prescription',
    auth(UserRole.DOCTOR),
    PrescriptionController.CreatePrescription
);

export const prescriptionRouters = router;
