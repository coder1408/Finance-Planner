const express = require("express");
const invoiceController = require("../controllers/invoiceController");
const router = express.Router();

router.get("/generate", invoiceController.generateInvoice);

module.exports = router;
