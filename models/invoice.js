import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  invoiceId: {
    type: String,
    required: true
  },
  invoiceDate: {
    type: Date,
    default: Date.now
  },
  deliveryDate: {
    type: Date
  },
  company: {
    companyName: String,
    creatorName: String,
    brandEmail: String,
    brandPhone: String,
    brandAddress: String
  },
  customer: {
    company: String,
    name: String,
    phone: String,
    email: String,
    address: String
  },
  items: [{
    serialNo: Number,
    productTitle: String,
    productDescription: String,
    quantity: Number,
    unitPrice: Number
  }],
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  },
  discountedTotal: {
    type: Number,
    default: 0
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  duePayment: {
    type: Number,
    default: 0
  },
  paymentMethod: String,
  paymentDetails: String,
  paymentStatus: String
});

let Invoice;
try {
  Invoice = mongoose.model('Invoice');
} catch {
  Invoice = mongoose.model('Invoice', invoiceSchema);
}

export default Invoice;
