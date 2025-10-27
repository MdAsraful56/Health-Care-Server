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

export const userRoutes = router;
