const express = require('express');
const router = express.Router();
const CreditNote = require('../models/CreditNote');
const PDFDocument = require('pdfkit');
const mongoose = require('mongoose');

// Get all credit notes
router.get('/', async (req, res) => {
  try {
    const creditNotes = await CreditNote.find().sort({ createdAt: -1 });
    res.json(creditNotes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single credit note
router.get('/:id', async (req, res) => {
  try {
    let creditNote = null;
    const { id } = req.params;
    
    // Try to find by _id first (MongoDB ObjectId)
    if (mongoose.Types.ObjectId.isValid(id)) {
      creditNote = await CreditNote.findById(id);
      console.log('Credit note found by _id:', creditNote ? 'Yes' : 'No');
    }
    
    // If not found by _id or if id is not a valid ObjectId, try to find by id field (numeric)
    if (!creditNote) {
      console.log('Trying to find by numeric id:', id);
      creditNote = await CreditNote.findOne({ id: parseInt(id) });
      console.log('Credit note found by id field:', creditNote ? 'Yes' : 'No');
    }
    
    if (!creditNote) {
      return res.status(404).json({ message: 'Credit note not found' });
    }
    res.json(creditNote);
  } catch (err) {
    console.error('Error finding credit note:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create credit note
router.post('/', async (req, res) => {
  try {
    // Clean up the request body
    const creditNoteData = { ...req.body };
    
    // Remove empty string values for ObjectId fields
    if (creditNoteData.invoiceId === '') {
      delete creditNoteData.invoiceId;
    }
    
    if (creditNoteData.estimateId === '') {
      delete creditNoteData.estimateId;
    }
    
    // Check if a credit note with the same ID already exists
    const existingCreditNote = await CreditNote.findOne({ id: creditNoteData.id });
    if (existingCreditNote) {
      // Generate a new ID if one already exists
      creditNoteData.id = Date.now();
    }
    
    const creditNote = new CreditNote(creditNoteData);
    const newCreditNote = await creditNote.save();
    res.status(201).json(newCreditNote);
  } catch (err) {
    // Handle duplicate key error specifically
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: 'A credit note with this ID already exists. Please try again with a different ID.' 
      });
    }
    res.status(400).json({ message: err.message });
  }
});

// Update credit note
router.patch('/:id', async (req, res) => {
  try {
    let creditNote = null;
    const { id } = req.params;
    
    console.log('Updating credit note with ID:', id);
    console.log('Request body:', req.body);
    
    // Try to find by _id first (MongoDB ObjectId)
    if (mongoose.Types.ObjectId.isValid(id)) {
      creditNote = await CreditNote.findById(id);
      console.log('Credit note found by _id:', creditNote ? 'Yes' : 'No');
    }
    
    // If not found by _id or if id is not a valid ObjectId, try to find by id field (numeric)
    if (!creditNote) {
      console.log('Trying to find by numeric id:', id);
      creditNote = await CreditNote.findOne({ id: parseInt(id) });
      console.log('Credit note found by id field:', creditNote ? 'Yes' : 'No');
    }
    
    if (!creditNote) {
      console.log('Credit note not found');
      return res.status(404).json({ message: 'Credit note not found' });
    }
    
    console.log('Before update:', creditNote);
    
    // Remove fields that should not be updated
    const { _id, id: bodyId, documentNumber, ...updateData } = req.body;
    
    // Update the credit note with the new data while preserving documentNumber
    const updatedCreditNote = await CreditNote.findByIdAndUpdate(
      creditNote._id,
      { ...updateData, documentNumber: creditNote.documentNumber },
      { new: true, runValidators: true }
    );
    
    console.log('Credit note saved successfully');
    
    res.json(updatedCreditNote);
  } catch (err) {
    console.error('Error updating credit note:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete credit note
router.delete('/:id', async (req, res) => {
  try {
    let creditNote = null;
    const { id } = req.params;
    
    // Try to find by _id first (MongoDB ObjectId)
    if (mongoose.Types.ObjectId.isValid(id)) {
      creditNote = await CreditNote.findById(id);
      console.log('Credit note found by _id:', creditNote ? 'Yes' : 'No');
    }
    
    // If not found by _id or if id is not a valid ObjectId, try to find by id field (numeric)
    if (!creditNote) {
      console.log('Trying to find by numeric id:', id);
      creditNote = await CreditNote.findOne({ id: parseInt(id) });
      console.log('Credit note found by id field:', creditNote ? 'Yes' : 'No');
    }
    
    if (!creditNote) {
      return res.status(404).json({ message: 'Credit note not found' });
    }
    
    await CreditNote.deleteOne({ _id: creditNote._id });
    res.json({ message: 'Credit note deleted' });
  } catch (err) {
    console.error('Error deleting credit note:', err);
    res.status(500).json({ message: err.message });
  }
});

// Generate PDF
router.get('/:id/pdf', async (req, res) => {
  try {
    let creditNote = null;
    const { id } = req.params;
    
    // Try to find by _id first (MongoDB ObjectId)
    if (mongoose.Types.ObjectId.isValid(id)) {
      creditNote = await CreditNote.findById(id);
      console.log('Credit note found by _id:', creditNote ? 'Yes' : 'No');
    }
    
    // If not found by _id or if id is not a valid ObjectId, try to find by id field (numeric)
    if (!creditNote) {
      console.log('Trying to find by numeric id:', id);
      creditNote = await CreditNote.findOne({ id: parseInt(id) });
      console.log('Credit note found by id field:', creditNote ? 'Yes' : 'No');
    }
    
    if (!creditNote) {
      return res.status(404).json({ message: 'Credit note not found' });
    }

    // Create PDF document
    const doc = new PDFDocument();
    
    // Set headers before piping
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=credit-note-${creditNote._id || creditNote.id}.pdf`);
    
    // Pipe the PDF to the response
    doc.pipe(res);

    // Add content to PDF
    doc.fontSize(25).text('CREDIT NOTE', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12);

    // Credit Note details
    doc.text(`Credit Note #: ${creditNote._id || creditNote.id}`);
    doc.text(`Date: ${new Date(creditNote.issueDate).toLocaleDateString()}`);
    doc.text(`Amount: Rs.${creditNote.amount.toFixed(2)}`);
    doc.text(`Status: ${creditNote.status}`);
    doc.moveDown();

    // Client Information
    if (creditNote.issuedTo) {
      doc.text('Issued To:', { underline: true });
      doc.text(`Name: ${creditNote.issuedTo.name || 'N/A'}`);
      doc.text(`Email: ${creditNote.issuedTo.email || 'N/A'}`);
      doc.text(`Address: ${creditNote.issuedTo.address || 'N/A'}`);
      doc.text(`Phone: ${creditNote.issuedTo.phone || 'N/A'}`);
      doc.moveDown();
    }

    // Items
    if (creditNote.items && creditNote.items.length > 0) {
      doc.text('Items:', { underline: true });
      creditNote.items.forEach(item => {
        doc.text(`${item.itemName}`);
        if (item.description) {
          doc.text(`Description: ${item.description}`);
        }
        doc.text(`Quantity: ${item.quantity} x Rs.${item.unitPrice.toFixed(2)} = Rs.${item.totalPrice.toFixed(2)}`);
        doc.moveDown(0.5);
      });
      doc.moveDown();
    }

    // Totals
    doc.text(`Subtotal: Rs.${creditNote.subtotal.toFixed(2)}`, { align: 'right' });
    doc.text(`Tax: Rs.${creditNote.tax.toFixed(2)}`, { align: 'right' });
    doc.text(`Total Amount: Rs.${creditNote.totalAmount.toFixed(2)}`, { align: 'right', bold: true });

    // Additional Information
    if (creditNote.reason) {
      doc.moveDown();
      doc.text('Reason:', { underline: true });
      doc.text(creditNote.reason);
    }

    if (creditNote.notes) {
      doc.moveDown();
      doc.text('Notes:', { underline: true });
      doc.text(creditNote.notes);
    }

    if (creditNote.terms) {
      doc.moveDown();
      doc.text('Terms:', { underline: true });
      doc.text(creditNote.terms);
    }

    // Finalize PDF
    doc.end();
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ message: 'Error generating PDF', error: err.message });
  }
});

module.exports = router; 