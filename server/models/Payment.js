const mongoose = require('mongoose');
const { generateDocumentNumber } = require('../utils/numberGenerator');

const paymentSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  documentNumber: { type: String, required: true, unique: true },
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentMethod: {
    type: String,
    enum: ['Bank Transfer', 'Credit Card', 'Cash', 'Check', 'PayPal', 'Other'],
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  currency: { type: String, default: 'INR' },
  notes: String,
  paidBy: String,
  paidByEmail: String,
  paidByPhone: String,
  receivedBy: String,
  transactionId: String,
  attachments: [{
    fileName: String,
    fileUrl: String,
    uploadDate: { type: Date, default: Date.now }
  }],
  metadata: {
    ipAddress: String,
    userAgent: String,
    location: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

paymentSchema.pre('save', async function(next) {
  if (this.isNew) {
    const { formattedNumber, numericId } = await generateDocumentNumber(this.constructor, 'payment');
    this.documentNumber = formattedNumber;
    this.id = numericId;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);