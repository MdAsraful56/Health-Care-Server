import express, { NextFunction, Request, Response } from 'express';
import { fileUploader } from '../../helpers/fileUploader';
import { AdminController } from './admin.controller';
import { AdminValidation } from './admin.validation';

const router = express.Router();

router.post(
    '/create-admin',
    // auth(UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = AdminValidation.createAdminValidationSchema.parse(
            JSON.parse(req.body.data)
        );
        return AdminController.createAdmin(req, res, next);
    }
);

export default router;
