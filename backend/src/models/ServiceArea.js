import mongoose from 'mongoose';

const serviceAreaSchema = new mongoose.Schema(
  {
    city: { type: String, required: true, unique: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincodesServed: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true },
    launchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const ServiceArea = mongoose.model('ServiceArea', serviceAreaSchema);
export default ServiceArea;
