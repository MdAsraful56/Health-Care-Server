import express, { NextFunction, Request, Response } from 'express';

import { fileUploader } from '../../helpers/fileUploader';
import { UserController } from './user.controller';
import { UserValidation } from './user.vaildition';

const router = express.Router();

router.post(
    '/create-patient',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.createPatientValidationSchema.parse(
            JSON.parse(req.body.data)
        );
        return UserController.createPatient(req, res, next);
    }
);

router.post(
    '/create-doctor',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.createDoctorValidationSchema.parse(
            JSON.parse(req.body.data)
        );
        return UserController.createDoctor(req, res, next);
    }
);

router.post(
    '/create-admin',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.createAdminValidationSchema.parse(
            JSON.parse(req.body.data)
        );
        return UserController.createAdmin(req, res, next);
    }
);

router.get('/all-users', UserController.getAllUsers);

router.get('/all-doctors', UserController.getAllDoctors);

router.get('/all-patients', UserController.getAllPatients);

router.get('/all-admins', UserController.getAllAdmins);

export const userRoutes = router;
