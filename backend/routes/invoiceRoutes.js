const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

router.get('/generate', invoiceController.generateInvoice);

module.exports = router;