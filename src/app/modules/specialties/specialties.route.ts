import { UserRole } from '@prisma/client';
import express, { NextFunction, Request, Response } from 'express';
import { fileUploader } from '../../helpers/fileUploader';
import auth from '../../middlewares/auth';
import { SpecialtiesController } from './specialties.controller';
import { SpecialtiesValidtaion } from './specialties.validation';

const router = express.Router();

router.get('/get-all-specialties', SpecialtiesController.GetAllSpecialties);

router.post(
    '/create-specialty',
    fileUploader.upload.single('file'),
    auth(UserRole.ADMIN),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = SpecialtiesValidtaion.create.parse(
            JSON.parse(req.body.data)
        );
        return SpecialtiesController.CreateSpecialty(req, res, next);
    }
);

router.delete(
    '/delete-specialty/:id',
    auth(UserRole.ADMIN),
    SpecialtiesController.DeleteSpecialty
);

export const SpecialtiesRoutes = router;
