import express from 'express';

const router = express.Router();

router.get('/payment/status', (req, res) => {
    res.send('Payment status endpoint');
});

export const PaymentRoute = router;
