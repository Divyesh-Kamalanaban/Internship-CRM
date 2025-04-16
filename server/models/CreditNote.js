const mongoose = require('mongoose');
const { generateDocumentNumber } = require('../utils/numberGenerator');

const creditNoteSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  documentNumber: { type: String, required: true, unique: true },
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: false },
  estimateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Estimate', required: false },
  amount: { type: Number, required: true },
  issueDate: { type: Date, default: Date.now },
  reason: {
    type: String,
    enum: ['Overpayment', 'Return', 'Cancellation', 'Adjustment', 'Other'],
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['Draft', 'Issued', 'Void'],
    default: 'Draft'
  },
  currency: { type: String, default: 'INR' },
  items: [{
    itemName: { type: String, required: true },
    description: String,
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true }
  }],
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  notes: String,
  terms: String,
  issuedBy: String,
  issuedTo: {
    name: { type: String, required: true },
    email: String,
    address: String,
    phone: String
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    uploadDate: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

creditNoteSchema.pre('save', async function(next) {
  if (this.isNew) {
    const { formattedNumber, numericId } = await generateDocumentNumber(this.constructor, 'creditNote');
    this.documentNumber = formattedNumber;
    this.id = numericId;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CreditNote', creditNoteSchema);