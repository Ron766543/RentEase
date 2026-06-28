import mongoose from 'mongoose';

const tenureOptionSchema = new mongoose.Schema(
  {
    months: { type: Number, required: true, min: 1 }, // e.g. 3, 6, 12
    monthlyRent: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, default: 0, min: 0, max: 90 }, // longer tenure = better rate
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, required: true, maxlength: 2000 },
    category: {
      type: String,
      required: true,
      enum: ['furniture', 'appliances'],
      index: true,
    },
    subCategory: {
      type: String,
      required: true,
      trim: true,
      // e.g. bed, sofa, table, fridge, washing-machine, tv, wardrobe, ac, microwave
    },
    brand: { type: String, trim: true, default: '' },
    images: [{ type: String, required: true }], // URLs / static paths
    securityDeposit: { type: Number, required: true, min: 0 },
    tenureOptions: {
      type: [tenureOptionSchema],
      validate: (v) => Array.isArray(v) && v.length > 0,
    },
    specs: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    condition: {
      type: String,
      enum: ['new', 'like-new', 'good', 'fair'],
      default: 'like-new',
    },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    serviceAreas: [{ type: String, trim: true }], // cities where this product can be delivered
    totalUnits: { type: Number, required: true, min: 0, default: 1 },
    availableUnits: { type: Number, required: true, min: 0, default: 1 },
    isPublished: { type: Boolean, default: true },
    ratingAverage: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ title: 'text', description: 'text', subCategory: 'text', brand: 'text' });

productSchema.virtual('isAvailable').get(function isAvailable() {
  return this.availableUnits > 0 && this.isPublished;
});

productSchema.set('toJSON', { virtuals: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
