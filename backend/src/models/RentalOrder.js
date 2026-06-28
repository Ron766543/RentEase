import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: { type: String, required: true }, // snapshot at order time
    image: { type: String },
    tenureMonths: { type: Number, required: true },
    monthlyRent: { type: Number, required: true },
    securityDeposit: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: true }
);

const rentalOrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], validate: (v) => v.length > 0 },

    deliveryAddress: {
      line1: String,
      line2: String,
      city: { type: String, required: true },
      state: String,
      pincode: String,
    },
    deliveryDate: { type: Date, required: true },
    deliverySlot: {
      type: String,
      enum: ['morning', 'afternoon', 'evening'],
      default: 'morning',
    },

    rentalStartDate: { type: Date },
    rentalEndDate: { type: Date }, // computed from tenure
    actualReturnDate: { type: Date },

    pickupRequested: { type: Boolean, default: false },
    pickupDate: { type: Date },
    pickupSlot: { type: String, enum: ['morning', 'afternoon', 'evening'] },

    extensionMonths: { type: Number, default: 0 },

    monthlyTotal: { type: Number, required: true },
    depositTotal: { type: Number, required: true },
    grandTotalFirstPayment: { type: Number, required: true }, // first month + deposit

    status: {
      type: String,
      enum: [
        'pending_confirmation',
        'confirmed',
        'out_for_delivery',
        'active',
        'return_scheduled',
        'returned',
        'cancelled',
      ],
      default: 'pending_confirmation',
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'failed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cash_on_delivery', 'card', 'upi', 'netbanking'],
      default: 'cash_on_delivery',
    },

    damageReported: { type: Boolean, default: false },
    damageNotes: { type: String, default: '' },
    damageCharge: { type: Number, default: 0 },

    notes: { type: String, default: '', maxlength: 500 },

    statusHistory: [
      {
        status: { type: String, required: true },
        changedAt: { type: Date, default: Date.now },
        note: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true }
);

rentalOrderSchema.index({ customer: 1, createdAt: -1 });

const RentalOrder = mongoose.model('RentalOrder', rentalOrderSchema);
export default RentalOrder;
