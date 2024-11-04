const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { authMiddleware } = require('../middleware/auth');

router.get('/generate', authMiddleware, invoiceController.generateInvoice);

module.exports = router;