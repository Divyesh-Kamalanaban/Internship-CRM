const mongoose = require('mongoose');
const { generateDocumentNumber } = require('../utils/numberGenerator');

const estimateItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  description: String,
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true }
});

const estimateSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  documentNumber: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ['Draft', 'Sent', 'Accepted', 'Declined', 'Expired'],
    default: 'Draft'
  },
  validUntil: { type: Date, required: true },
  issueDate: { type: Date, default: Date.now },
  clientDetails: {
    name: { type: String, required: true },
    email: String,
    address: String,
    phone: String
  },
  items: [estimateItemSchema],
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  discount: {
    type: { type: String, enum: ['Percentage', 'Fixed'] },
    value: Number
  },
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  notes: String,
  terms: String,
  attachments: [{
    fileName: String,
    fileUrl: String,
    uploadDate: { type: Date, default: Date.now }
  }],
  convertedToInvoice: {
    isConverted: { type: Boolean, default: false },
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
    convertedDate: Date
  },
  metadata: {
    createdBy: String,
    lastModifiedBy: String,
    tags: [String]
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

estimateSchema.pre('save', async function(next) {
  if (this.isNew) {
    const { formattedNumber, numericId } = await generateDocumentNumber(this.constructor, 'estimate');
    this.documentNumber = formattedNumber;
    this.id = numericId;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Estimate', estimateSchema);