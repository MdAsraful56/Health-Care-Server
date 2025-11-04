import express, { NextFunction, Request, Response } from 'express';
import { fileUploader } from '../../helpers/fileUploader';
import { DoctorController } from './doctor.controller';
import { DoctorValidation } from './doctor.validation';

const router = express.Router();

router.post(
    '/create-doctor',
    // auth(UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = DoctorValidation.createDoctorValidationSchema.parse(
            JSON.parse(req.body.data)
        );
        return DoctorController.CreateDoctor(req, res, next);
    }
);

router.get('/get-all-doctors', DoctorController.getAllDoctors);

router.patch('/update-doctor/:id', DoctorController.updateDoctor);

router.post('/suggestion', DoctorController.getAISuggestion);

export const DoctorRoutes = router;
