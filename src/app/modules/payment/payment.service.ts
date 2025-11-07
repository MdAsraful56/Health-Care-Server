import { PaymentStatus } from '@prisma/client';
import Stripe from 'stripe';
import prisma from '../../config/db';

const handleStripeWebhookEvent = async (event: Stripe.Event) => {
    console.log('📥 Processing webhook event:', event.type);

    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;

            const appointmentId = session.metadata?.appointmentId;
            const paymentId = session.metadata?.paymentId;

            console.log('📋 Metadata:', { appointmentId, paymentId });
            console.log('💳 Payment Status:', session.payment_status);

            if (!appointmentId || !paymentId) {
                console.error('❌ Missing metadata in session');
                throw new Error(
                    'Missing appointmentId or paymentId in metadata'
                );
            }

            // Transaction ব্যবহার করে atomically update করুন
            await prisma.$transaction(async (tx) => {
                const paymentStatus =
                    session.payment_status === 'paid'
                        ? PaymentStatus.PAID
                        : PaymentStatus.UNPAID;

                // Appointment update
                const updatedAppointment = await tx.appointment.update({
                    where: { id: appointmentId },
                    data: { paymentStatus },
                });
                console.log('✅ Appointment updated:', updatedAppointment.id);

                // Payment update
                const updatedPayment = await tx.payment.update({
                    where: { id: paymentId },
                    data: {
                        status: paymentStatus,
                        paymentGatewayData: session as any,
                    },
                });
                console.log('✅ Payment updated:', updatedPayment.id);
            });

            break;
        }

        default:
            console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }
};

export const PaymentService = {
    handleStripeWebhookEvent,
};
