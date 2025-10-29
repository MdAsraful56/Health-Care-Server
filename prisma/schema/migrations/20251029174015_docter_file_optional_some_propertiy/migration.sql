-- AlterTable
ALTER TABLE "doctors" ALTER COLUMN "contactNumber" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "registrationNumber" DROP NOT NULL,
ALTER COLUMN "appointmentFee" DROP NOT NULL,
ALTER COLUMN "qualification" DROP NOT NULL,
ALTER COLUMN "currentWorkingPlace" DROP NOT NULL,
ALTER COLUMN "designation" DROP NOT NULL;
