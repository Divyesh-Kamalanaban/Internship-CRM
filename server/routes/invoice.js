const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const Invoice = require('../models/Invoice');
const fs = require('fs');
const path = require('path');

// Get all invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single invoice
router.get('/:id', async (req, res) => {
  try {
    let invoice = null;
    
    // Try to find by _id first (MongoDB ObjectId)
    try {
      invoice = await Invoice.findById(req.params.id);
    } catch (err) {
      // If findById fails (e.g., invalid ObjectId format), try to find by id field
      console.log('findById failed, trying findOne with id field');
    }
    
    // If not found by _id or findById failed, try to find by id field (numeric)
    if (!invoice) {
      invoice = await Invoice.findOne({ id: parseInt(req.params.id) });
    }
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new invoice
router.post('/', async (req, res) => {
  const invoice = new Invoice(req.body);
  try {
    const newInvoice = await invoice.save();
    res.status(201).json(newInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Download invoice as PDF
router.get('/:id/download', async (req, res) => {
  try {
    let invoice = null;
    
    // Try to find by _id first (MongoDB ObjectId)
    try {
      invoice = await Invoice.findById(req.params.id);
    } catch (err) {
      // If findById fails (e.g., invalid ObjectId format), try to find by id field
      console.log('findById failed, trying findOne with id field');
    }
    
    // If not found by _id or findById failed, try to find by id field (numeric)
    if (!invoice) {
      invoice = await Invoice.findOne({ id: parseInt(req.params.id) });
    }
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Create a new PDF document
    const doc = new PDFDocument();
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.id}.pdf`);

    // Pipe the PDF directly to the response
    doc.pipe(res);

    // Add content to the PDF
    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.moveDown();

    // Bill From section
    doc.fontSize(12).text('From:', { continued: true }).fontSize(10).text(invoice.billFrom);
    doc.fontSize(10).text(`Email: ${invoice.billFromEmail || 'N/A'}`);
    doc.fontSize(10).text(`Address: ${invoice.billFromAddress || 'N/A'}`);
    doc.fontSize(10).text(`Phone: ${invoice.billFromPhone || 'N/A'}`);
    doc.moveDown();

    // Bill To section
    doc.fontSize(12).text('To:', { continued: true }).fontSize(10).text(invoice.billTo);
    doc.fontSize(10).text(`Email: ${invoice.billToEmail || 'N/A'}`);
    doc.fontSize(10).text(`Address: ${invoice.billToAddress || 'N/A'}`);
    doc.fontSize(10).text(`Phone: ${invoice.billToPhone || 'N/A'}`);
    doc.moveDown();

    // Invoice Details
    doc.fontSize(12).text(`Invoice ID: ${invoice.id}`);
    doc.fontSize(10).text(`Date: ${new Date(invoice.orderDate).toLocaleDateString()}`);
    doc.fontSize(10).text(`Status: ${invoice.status}`);
    doc.moveDown();

    // Orders table
    doc.fontSize(12).text('Order Items');
    doc.moveDown();
    invoice.orders.forEach(order => {
      doc.fontSize(10).text(`${order.itemName} - ${order.description || 'N/A'}`);
      doc.fontSize(10).text(`Units: ${order.units} x ₹${order.unitPrice} = ₹${order.unitTotalPrice}`);
      doc.moveDown(0.5);
    });
    doc.moveDown();

    // Totals
    doc.fontSize(10).text(`Subtotal: ₹${invoice.totalCost}`, { align: 'right' });
    doc.fontSize(10).text(`VAT (${(invoice.vat / invoice.totalCost * 100).toFixed(2)}%): ₹${invoice.vat}`, { align: 'right' });
    doc.fontSize(12).text(`Grand Total: ₹${invoice.grandTotal}`, { align: 'right' });

    // Finalize the PDF
    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update invoice
router.put('/:id', async (req, res) => {
  try {
    let invoice = null;
    
    // Try to find by _id first (MongoDB ObjectId)
    try {
      invoice = await Invoice.findById(req.params.id);
    } catch (err) {
      // If findById fails (e.g., invalid ObjectId format), try to find by id field
      console.log('findById failed, trying findOne with id field');
    }
    
    // If not found by _id or findById failed, try to find by id field (numeric)
    if (!invoice) {
      invoice = await Invoice.findOne({ id: parseInt(req.params.id) });
    }
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    // Preserve the documentNumber and id fields
    const { documentNumber, id, ...updateData } = req.body;
    
    // Update the invoice with the new data while preserving documentNumber
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      invoice._id,
      { ...updateData, documentNumber: invoice.documentNumber },
      { new: true, runValidators: true }
    );
    
    res.json(updatedInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete invoice
router.delete('/:id', async (req, res) => {
  try {
    let invoice = null;
    
    // Try to find by _id first (MongoDB ObjectId)
    try {
      invoice = await Invoice.findById(req.params.id);
    } catch (err) {
      // If findById fails (e.g., invalid ObjectId format), try to find by id field
      console.log('findById failed, trying findOne with id field');
    }
    
    // If not found by _id or findById failed, try to find by id field (numeric)
    if (!invoice) {
      invoice = await Invoice.findOne({ id: parseInt(req.params.id) });
    }
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    // Delete using the _id field
    await Invoice.deleteOne({ _id: invoice._id });
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    console.error('Error deleting invoice:', err);
    res.status(500).json({ message: err.message });
  }
});

// Generate PDF
router.get('/:id/pdf', async (req, res) => {
  try {
    let invoice = null;
    
    // Try to find by _id first (MongoDB ObjectId)
    try {
      invoice = await Invoice.findById(req.params.id);
    } catch (err) {
      // If findById fails (e.g., invalid ObjectId format), try to find by id field
      console.log('findById failed, trying findOne with id field');
    }
    
    // If not found by _id or findById failed, try to find by id field (numeric)
    if (!invoice) {
      invoice = await Invoice.findOne({ id: parseInt(req.params.id) });
    }
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Create PDF document
    const doc = new PDFDocument();
    
    // Set headers before piping
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=invoice-${invoice._id || invoice.id}.pdf`);
    
    // Pipe the PDF to the response
    doc.pipe(res);

    // Add content to PDF
    doc.fontSize(25).text('INVOICE', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12);

    // Invoice details
    doc.text(`Invoice #: ${invoice._id || invoice.id}`);
    doc.text(`Date: ${new Date(invoice.orderDate).toLocaleDateString()}`);
    doc.moveDown();

    // Bill from/to
    doc.text('From:', { underline: true });
    doc.text(invoice.billFrom);
    doc.text(invoice.billFromAddress);
    doc.text(invoice.billFromEmail);
    doc.moveDown();

    doc.text('To:', { underline: true });
    doc.text(invoice.billTo);
    doc.text(invoice.billToAddress);
    doc.text(invoice.billToEmail);
    doc.moveDown();

    // Items table
    doc.text('Items:', { underline: true });
    invoice.orders.forEach(item => {
      const itemTotal = item.units * item.unitPrice;
      doc.text(`${item.itemName} - ${item.units} x Rs.${item.unitPrice.toFixed(2)} = Rs.${itemTotal.toFixed(2)}`);
      if (item.description) {
        doc.text(`Description: ${item.description}`);
      }
      doc.moveDown(0.5);
    });
    doc.moveDown();

    // Calculate totals
    const subtotal = invoice.totalCost;
    const vat = invoice.vat;
    const grandTotal = subtotal + vat;

    // Display totals
    doc.text(`Subtotal: Rs.${subtotal.toFixed(2)}`, { align: 'right' });
    doc.text(`VAT: Rs.${vat.toFixed(2)}`, { align: 'right' });
    doc.text(`Grand Total: Rs.${grandTotal.toFixed(2)}`, { align: 'right', bold: true });

    // Finalize PDF
    doc.end();
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ message: 'Error generating PDF', error: err.message });
  }
});

// Add payment record
router.post('/:id/payments', async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ id: req.params.id });
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    invoice.paymentRecords.push(req.body);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Set recurring settings
router.post('/:id/recurring', async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ id: req.params.id });
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    invoice.recurring = req.body;
    await invoice.save();
    res.json(invoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;