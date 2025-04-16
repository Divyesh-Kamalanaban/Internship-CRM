const mongoose = require('mongoose');
const { generateDocumentNumber } = require('../utils/numberGenerator');

const orderItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  description: String,
  units: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  unitTotalPrice: { type: Number, required: true }
});

const invoiceSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  documentNumber: { type: String, required: true, unique: true },
  billFrom: { type: String, required: true },
  billFromEmail: String,
  billFromAddress: String,
  billFromPhone: String,
  billTo: { type: String, required: true },
  billToEmail: String,
  billToAddress: String,
  billToPhone: String,
  orderDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered'],
    default: 'Pending'
  },
  orders: [orderItemSchema],
  totalCost: { type: Number, required: true },
  vat: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
  // Additional fields from Perfex CRM
  currency: { type: String, default: 'INR' },
  recurring: {
    isRecurring: { type: Boolean, default: false },
    frequency: { type: String, enum: ['monthly', 'quarterly', 'semi-annually', 'annually'] },
    startDate: Date,
    nextDate: Date,
    endDate: Date
  },
  paymentRecords: [{
    amount: Number,
    date: { type: Date, default: Date.now },
    method: String,
    reference: String
  }],
  notes: String,
  terms: String,
  dueDate: Date,
  remindersSent: [{
    date: Date,
    type: { type: String, enum: ['first', 'second', 'third', 'overdue'] }
  }]
}, {
  timestamps: true
});

// Calculate totals before saving
invoiceSchema.pre('save', async function(next) {
  if (this.isNew) {
    const { formattedNumber, numericId } = await generateDocumentNumber(this.constructor, 'invoice');
    this.documentNumber = formattedNumber;
    this.id = numericId;
  }

  if (this.orders && this.orders.length > 0) {
    this.totalCost = this.orders.reduce((sum, order) => sum + order.unitTotalPrice, 0);
    this.grandTotal = this.totalCost + (this.totalCost * this.vat / 100);
  }
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);