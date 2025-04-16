const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const PDFDocument = require('pdfkit');

// Get all payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single payment
router.get('/:id', async (req, res) => {
  try {
    let payment = null;
    
    // Try to find by _id first (MongoDB ObjectId)
    try {
      payment = await Payment.findById(req.params.id);
    } catch (err) {
      // If findById fails (e.g., invalid ObjectId format), try to find by id field
      console.log('findById failed, trying findOne with id field');
    }
    
    // If not found by _id or findById failed, try to find by id field (numeric)
    if (!payment) {
      const numericId = parseInt(req.params.id);
      if (!isNaN(numericId)) {
        payment = await Payment.findOne({ id: numericId });
      }
    }
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create payment
router.post('/', async (req, res) => {
  try {
    // Clean up the request body
    const paymentData = { ...req.body };
    
    // Validate required fields
    if (!paymentData.amount || isNaN(paymentData.amount)) {
      return res.status(400).json({ message: 'Amount is required and must be a number' });
    }

    if (!paymentData.paymentMethod) {
      return res.status(400).json({ message: 'Payment method is required' });
    }

    // Check if a payment with the same ID already exists
    const existingPayment = await Payment.findOne({ id: paymentData.id });
    if (existingPayment) {
      // Generate a new ID if one already exists
      paymentData.id = Date.now();
    }
    
    const payment = new Payment(paymentData);
    const newPayment = await payment.save();
    res.status(201).json(newPayment);
  } catch (err) {
    // Handle duplicate key error specifically
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: 'A payment with this ID already exists. Please try again with a different ID.' 
      });
    }
    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: Object.values(err.errors).map(error => error.message)
      });
    }
    res.status(400).json({ message: err.message });
  }
});

// Update payment
router.put('/:id', async (req, res) => {
  try {
    let payment = null;
    const id = req.params.id || req.body._id;
    
    if (!id) {
      return res.status(400).json({ message: 'Payment ID is required' });
    }
    
    console.log('Looking for payment with ID:', id);
    
    // Try to find by _id first (MongoDB ObjectId)
    try {
      payment = await Payment.findById(id);
      console.log('Payment found by _id:', payment ? 'Yes' : 'No');
    } catch (err) {
      console.log('findById failed, trying findOne with id field');
    }
    
    // If not found by _id or findById failed, try to find by id field (numeric)
    if (!payment) {
      const numericId = parseInt(id);
      if (!isNaN(numericId)) {
        payment = await Payment.findOne({ id: numericId });
        console.log('Payment found by numeric id:', payment ? 'Yes' : 'No');
      }
    }
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    // Preserve the documentNumber and id fields
    const { documentNumber, id: bodyId, ...updateData } = req.body;
    
    // Update the payment with the new data
    Object.assign(payment, updateData);
    const updatedPayment = await payment.save();
    
    res.json(updatedPayment);
  } catch (err) {
    console.error('Error updating payment:', err);
    res.status(400).json({ message: err.message });
  }
});

// Patch payment (partial update)
router.patch('/:id', async (req, res) => {
  try {
    let payment = null;
    const id = req.params.id || req.body._id;
    
    if (!id) {
      return res.status(400).json({ message: 'Payment ID is required' });
    }
    
    console.log('Looking for payment with ID:', id);
    
    // Try to find by _id first (MongoDB ObjectId)
    try {
      payment = await Payment.findById(id);
      console.log('Payment found by _id:', payment ? 'Yes' : 'No');
    } catch (err) {
      console.log('findById failed, trying findOne with id field');
    }
    
    // If not found by _id or findById failed, try to find by id field (numeric)
    if (!payment) {
      const numericId = parseInt(id);
      if (!isNaN(numericId)) {
        payment = await Payment.findOne({ id: numericId });
        console.log('Payment found by numeric id:', payment ? 'Yes' : 'No');
      }
    }
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    // Remove fields that should not be updated
    const { _id, id: bodyId, documentNumber, ...updateData } = req.body;
    
    // Update the payment with the new data while preserving documentNumber
    const updatedPayment = await Payment.findByIdAndUpdate(
      payment._id,
      { ...updateData, documentNumber: payment.documentNumber },
      { new: true, runValidators: true }
    );
    
    res.json(updatedPayment);
  } catch (err) {
    console.error('Error updating payment:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete payment
router.delete('/:id', async (req, res) => {
  try {
    let payment = null;
    
    // Try to find by _id first (MongoDB ObjectId)
    try {
      payment = await Payment.findById(req.params.id);
    } catch (err) {
      // If findById fails, try to find by id field
      console.log('findById failed, trying findOne with id field');
    }
    
    // If not found by _id or findById failed, try to find by id field (numeric)
    if (!payment) {
      const numericId = parseInt(req.params.id);
      if (!isNaN(numericId)) {
        payment = await Payment.findOne({ id: numericId });
      }
    }
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    await payment.deleteOne();
    res.json({ message: 'Payment deleted' });
  } catch (err) {
    console.error('Error deleting payment:', err);
    res.status(500).json({ message: err.message });
  }
});

// Generate PDF
router.get('/:id/pdf', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Create PDF document
    const doc = new PDFDocument();
    
    // Set headers before piping
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=payment-${payment._id}.pdf`);
    
    // Pipe the PDF to the response
    doc.pipe(res);

    // Add content to PDF
    doc.fontSize(25).text('PAYMENT RECEIPT', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12);

    // Payment details
    doc.text(`Payment #: ${payment._id}`);
    doc.text(`Date: ${new Date(payment.paymentDate).toLocaleDateString()}`);
    doc.text(`Amount: Rs.${payment.amount.toFixed(2)}`);
    doc.text(`Payment Method: ${payment.paymentMethod}`);
    doc.text(`Status: ${payment.status}`);
    doc.moveDown();

    // Reference information
    if (payment.invoiceId) {
      doc.text(`Invoice Reference: ${payment.invoiceId}`);
    }
    if (payment.referenceNumber) {
      doc.text(`Reference Number: ${payment.referenceNumber}`);
    }
    doc.moveDown();

    // Notes
    if (payment.notes) {
      doc.text('Notes:', { underline: true });
      doc.text(payment.notes);
    }

    // Finalize PDF
    doc.end();
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ message: 'Error generating PDF', error: err.message });
  }
});

module.exports = router;