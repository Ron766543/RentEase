import asyncHandler from 'express-async-handler';
import MaintenanceRequest from '../models/MaintenanceRequest.js';
import RentalOrder from '../models/RentalOrder.js';
import Product from '../models/Product.js';

export const createMaintenanceRequest = asyncHandler(async (req, res) => {
  const { orderId, productId, issueType, description, preferredDate, photos } = req.body;

  const order = await RentalOrder.findById(orderId);
  if (!order || order.customer.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Order not found for this customer.');
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }

  const request = await MaintenanceRequest.create({
    order: orderId,
    product: productId,
    customer: req.user._id,
    vendor: product.vendor,
    issueType,
    description,
    preferredDate,
    photos: photos || [],
  });

  res.status(201).json({ success: true, request });
});

export const getMyMaintenanceRequests = asyncHandler(async (req, res) => {
  const requests = await MaintenanceRequest.find({ customer: req.user._id })
    .populate('product', 'title images')
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, items: requests });
});

export const getVendorMaintenanceRequests = asyncHandler(async (req, res) => {
  const requests = await MaintenanceRequest.find({ vendor: req.user._id })
    .populate('product', 'title images')
    .populate('customer', 'name phone')
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, items: requests });
});

export const updateMaintenanceStatus = asyncHandler(async (req, res) => {
  const request = await MaintenanceRequest.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error('Maintenance request not found.');
  }
  if (request.vendor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('You do not have permission to update this request.');
  }

  const { status, priority, resolutionNotes } = req.body;
  if (status) request.status = status;
  if (priority) request.priority = priority;
  if (resolutionNotes !== undefined) request.resolutionNotes = resolutionNotes;
  if (status === 'resolved' || status === 'closed') request.resolvedAt = new Date();

  await request.save();
  res.status(200).json({ success: true, request });
});

export const getAllMaintenanceRequests = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = {};
  if (status) query.status = status;

  const requests = await MaintenanceRequest.find(query)
    .populate('product', 'title')
    .populate('customer', 'name email')
    .populate('vendor', 'name businessName')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, items: requests });
});
