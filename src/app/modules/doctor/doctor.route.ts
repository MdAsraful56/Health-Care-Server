import { UserRole } from '@prisma/client';
import express, { NextFunction, Request, Response } from 'express';
import { fileUploader } from '../../helpers/fileUploader';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { DoctorController } from './doctor.controller';
import { DoctorValidation } from './doctor.validation';

const router = express.Router();

router.post(
    '/create-doctor',
    auth(UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = DoctorValidation.createDoctorValidationSchema.parse(
            JSON.parse(req.body.data)
        );
        return DoctorController.CreateDoctor(req, res, next);
    }
);

router.get('/get-all-doctors', DoctorController.getAllDoctors);

router.patch(
    '/update-doctor/:id',
    auth(UserRole.ADMIN, UserRole.DOCTOR),
    validateRequest(DoctorValidation.updateDoctorValidationSchema),
    DoctorController.updateDoctor
);

router.get('/get-single-doctor/:id', DoctorController.getSingleDoctor);

router.delete(
    '/delete-doctor/:id',
    auth(UserRole.ADMIN, UserRole.DOCTOR),
    DoctorController.deleteDoctor
);

router.post('/suggestion', DoctorController.getAISuggestion);

export const DoctorRoutes = router;
