const express = require('express');
const router = express.Router();
const Estimate = require('../models/Estimate');
const PDFDocument = require('pdfkit');
const mongoose = require('mongoose');

// Get all estimates
router.get('/', async (req, res) => {
  try {
    const estimates = await Estimate.find().sort({ createdAt: -1 });
    res.json(estimates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single estimate
router.get('/:id', async (req, res) => {
  try {
    let estimate = null;
    const { id } = req.params;
    
    // Try to find by _id first (MongoDB ObjectId)
    if (mongoose.Types.ObjectId.isValid(id)) {
      estimate = await Estimate.findById(id);
      console.log('Estimate found by _id:', estimate ? 'Yes' : 'No');
    }
    
    // If not found by _id or if id is not a valid ObjectId, try to find by id field (numeric)
    if (!estimate) {
      console.log('Trying to find by numeric id:', id);
      estimate = await Estimate.findOne({ id: parseInt(id) });
      console.log('Estimate found by id field:', estimate ? 'Yes' : 'No');
    }
    
    if (!estimate) {
      return res.status(404).json({ message: 'Estimate not found' });
    }
    res.json(estimate);
  } catch (err) {
    console.error('Error finding estimate:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create estimate
router.post('/', async (req, res) => {
  try {
    // Clean up the request body
    const estimateData = { ...req.body };
    
    // Check if an estimate with the same ID already exists
    const existingEstimate = await Estimate.findOne({ id: estimateData.id });
    if (existingEstimate) {
      // Generate a new ID if one already exists
      estimateData.id = Date.now();
    }
    
    const estimate = new Estimate(estimateData);
    const newEstimate = await estimate.save();
    res.status(201).json(newEstimate);
  } catch (err) {
    // Handle duplicate key error specifically
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: 'An estimate with this ID already exists. Please try again with a different ID.' 
      });
    }
    res.status(400).json({ message: err.message });
  }
});

// Update estimate (PATCH)
router.patch('/:id', async (req, res) => {
  try {
    let estimate = null;
    const { id } = req.params;
    
    console.log('Updating estimate with ID:', id);
    console.log('Request body:', req.body);
    
    // Try to find by _id first (MongoDB ObjectId)
    if (mongoose.Types.ObjectId.isValid(id)) {
      estimate = await Estimate.findById(id);
      console.log('Estimate found by _id:', estimate ? 'Yes' : 'No');
    }
    
    // If not found by _id or if id is not a valid ObjectId, try to find by id field (numeric)
    if (!estimate) {
      console.log('Trying to find by numeric id:', id);
      estimate = await Estimate.findOne({ id: parseInt(id) });
      console.log('Estimate found by id field:', estimate ? 'Yes' : 'No');
    }
    
    if (!estimate) {
      console.log('Estimate not found');
      return res.status(404).json({ message: 'Estimate not found' });
    }
    
    console.log('Before update:', estimate);
    
    // Remove fields that should not be updated
    const { _id, id: bodyId, documentNumber, ...updateData } = req.body;
    
    // Update the estimate with the new data while preserving documentNumber
    const updatedEstimate = await Estimate.findByIdAndUpdate(
      estimate._id,
      { ...updateData, documentNumber: estimate.documentNumber },
      { new: true, runValidators: true }
    );
    
    console.log('Estimate saved successfully');
    
    res.json(updatedEstimate);
  } catch (err) {
    console.error('Error updating estimate:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete estimate
router.delete('/:id', async (req, res) => {
  try {
    let estimate = null;
    const { id } = req.params;
    
    // Try to find by _id first (MongoDB ObjectId)
    if (mongoose.Types.ObjectId.isValid(id)) {
      estimate = await Estimate.findById(id);
      console.log('Estimate found by _id:', estimate ? 'Yes' : 'No');
    }
    
    // If not found by _id or if id is not a valid ObjectId, try to find by id field (numeric)
    if (!estimate) {
      console.log('Trying to find by numeric id:', id);
      estimate = await Estimate.findOne({ id: parseInt(id) });
      console.log('Estimate found by id field:', estimate ? 'Yes' : 'No');
    }
    
    if (!estimate) {
      return res.status(404).json({ message: 'Estimate not found' });
    }
    
    await Estimate.deleteOne({ _id: estimate._id });
    res.json({ message: 'Estimate deleted' });
  } catch (err) {
    console.error('Error deleting estimate:', err);
    res.status(500).json({ message: err.message });
  }
});

// Generate PDF
router.get('/:id/pdf', async (req, res) => {
  try {
    let estimate = null;
    const { id } = req.params;
    
    // Try to find by _id first (MongoDB ObjectId)
    if (mongoose.Types.ObjectId.isValid(id)) {
      estimate = await Estimate.findById(id);
      console.log('Estimate found by _id:', estimate ? 'Yes' : 'No');
    }
    
    // If not found by _id or if id is not a valid ObjectId, try to find by id field (numeric)
    if (!estimate) {
      console.log('Trying to find by numeric id:', id);
      estimate = await Estimate.findOne({ id: parseInt(id) });
      console.log('Estimate found by id field:', estimate ? 'Yes' : 'No');
    }
    
    if (!estimate) {
      return res.status(404).json({ message: 'Estimate not found' });
    }

    // Create PDF document
    const doc = new PDFDocument();
    
    // Set headers before piping
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=estimate-${estimate._id || estimate.id}.pdf`);
    
    // Pipe the PDF to the response
    doc.pipe(res);

    // Add content to PDF
    doc.fontSize(25).text('ESTIMATE', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12);

    // Estimate details
    doc.text(`Estimate #: ${estimate.estimateNumber}`);
    doc.text(`Date: ${new Date(estimate.issueDate).toLocaleDateString()}`);
    doc.text(`Valid Until: ${new Date(estimate.validUntil).toLocaleDateString()}`);
    doc.text(`Status: ${estimate.status}`);
    doc.moveDown();

    // Client Information
    if (estimate.clientDetails) {
      doc.text('Client Information:', { underline: true });
      doc.text(`Name: ${estimate.clientDetails.name || 'N/A'}`);
      doc.text(`Email: ${estimate.clientDetails.email || 'N/A'}`);
      doc.text(`Address: ${estimate.clientDetails.address || 'N/A'}`);
      doc.text(`Phone: ${estimate.clientDetails.phone || 'N/A'}`);
      doc.moveDown();
    }

    // Items
    if (estimate.items && estimate.items.length > 0) {
      doc.text('Items:', { underline: true });
      estimate.items.forEach(item => {
        doc.text(`${item.itemName} - ${item.quantity} x Rs.${item.unitPrice.toFixed(2)} = Rs.${item.totalPrice.toFixed(2)}`);
        if (item.description) {
          doc.text(`Description: ${item.description}`);
        }
        doc.moveDown(0.5);
      });
      doc.moveDown();
    }

    // Totals
    doc.text(`Subtotal: Rs.${estimate.subtotal.toFixed(2)}`, { align: 'right' });
    doc.text(`Tax: Rs.${estimate.tax.toFixed(2)}`, { align: 'right' });
    if (estimate.discount && estimate.discount.value) {
      const discountText = estimate.discount.type === 'Percentage' 
        ? `${estimate.discount.value}%`
        : `Rs.${estimate.discount.value.toFixed(2)}`;
      doc.text(`Discount (${discountText}): Rs.${estimate.discount.value.toFixed(2)}`, { align: 'right' });
    }
    doc.text(`Total Amount: Rs.${estimate.totalAmount.toFixed(2)}`, { align: 'right', bold: true });

    // Additional Information
    if (estimate.notes) {
      doc.text('Notes:', { underline: true });
      doc.text(estimate.notes);
      doc.moveDown();
    }

    if (estimate.terms) {
      doc.text('Terms & Conditions:', { underline: true });
      doc.text(estimate.terms);
    }

    // Finalize PDF
    doc.end();
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ message: 'Error generating PDF', error: err.message });
  }
});

module.exports = router;