import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import { PatientController } from './patient.controller';

const router = express.Router();

router.get('/all-patients', PatientController.GetAllPatients);

router.get('/get-single-patient/:id', PatientController.GetPatientById);

router.patch(
    '/update-patient',
    auth(UserRole.PATIENT),
    PatientController.UpdatePatient
);

router.delete(
    '/soft-delete',
    auth(UserRole.PATIENT),
    PatientController.SoftDelete
);

export const PatientRoutes = router;
