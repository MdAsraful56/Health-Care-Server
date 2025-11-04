import express, { NextFunction, Request, Response } from 'express';

import { UserRole } from '@prisma/client';
import { fileUploader } from '../../helpers/fileUploader';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
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

router.get('/all-patients', UserController.getAllPatients);

router.patch(
    '/update-patient/:id',
    auth(UserRole.ADMIN, UserRole.PATIENT),
    validateRequest(UserValidation.updatePatientValidationSchema),
    UserController.UpdatePatient
);

router.delete('/delete-patient/:id', UserController.DeletePatient);

router.get('/all-users', auth(UserRole.ADMIN), UserController.getAllUsers);

export const userRoutes = router;
