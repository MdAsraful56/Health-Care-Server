import { UserRole } from '@prisma/client';
import express, { NextFunction, Request, Response } from 'express';
import { fileUploader } from '../../helpers/fileUploader';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
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

router.get('/all-admins', auth(UserRole.ADMIN), AdminController.GetAllAdmins);

router.patch(
    '/update-admin/:id',
    auth(UserRole.ADMIN),
    validateRequest(AdminValidation.updateAdminValidationSchema),
    AdminController.UpdateAdmin
);

router.get(
    '/get-single-admin/:id',
    auth(UserRole.ADMIN),
    AdminController.GetSingleAdmin
);

router.delete('/delete-admin/:id', AdminController.DeleteAdmin);

export const adminRouters = router;
