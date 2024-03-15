import mongoose from "mongoose";

const { Schema, model } = mongoose;

const invoiceSchema = new Schema({
  invoiceId: {
    type: String,
    required: true
  },
  invoiceDate: {
    type: Date,
    required: true
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  company: {
    companyName: {
      type: String,
      required: true
    },
    creatorName: {
      type: String,
      required: true
    },
    brandEmail: {
      type: String,
      required: true
    },
    brandPhone: {
      type: String,
      required: true
    },
    brandAddress: {
      type: String,
      required: true
    }
  },
  customer: {
    company: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  items: [{
    serialNo: {
      type: Number,
      required: true
    },
    productTitle: {
      type: String,
      required: true
    },
    productDescription: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    unitPrice: {
      type: Number,
      required: true
    }
  }],
  discount: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  discountedPrice: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  paymentDetails: {
    type: String,
    required: true
  }
});

const Invoice = mongoose.models.Invoice || model("Invoice", invoiceSchema);

export default Invoice;
