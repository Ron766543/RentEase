import mongoose from 'mongoose';

const maintenanceRequestSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'RentalOrder', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    issueType: {
      type: String,
      enum: ['not_working', 'damaged', 'noisy', 'cleaning', 'replacement', 'other'],
      required: true,
    },
    description: { type: String, required: true, maxlength: 1000 },
    preferredDate: { type: Date },
    photos: [{ type: String }],

    status: {
      type: String,
      enum: ['open', 'acknowledged', 'technician_assigned', 'resolved', 'closed'],
      default: 'open',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    resolutionNotes: { type: String, default: '' },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

maintenanceRequestSchema.index({ customer: 1, createdAt: -1 });
maintenanceRequestSchema.index({ vendor: 1, status: 1 });

const MaintenanceRequest = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);
export default MaintenanceRequest;
