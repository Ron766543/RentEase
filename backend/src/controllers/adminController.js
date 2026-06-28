import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Product from '../models/Product.js';
import RentalOrder from '../models/RentalOrder.js';
import MaintenanceRequest from '../models/MaintenanceRequest.js';
import ServiceArea from '../models/ServiceArea.js';

export const getAllUsers = asyncHandler(async (req, res) => {
  const { role } = req.query;
  const query = {};
  if (role) query.role = role;
  const users = await User.find(query).sort({ createdAt: -1 });
  res.status(200).json({ success: true, items: users.map((u) => u.toSafeJSON()) });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }
  const { isActive, vendorApproved } = req.body;
  if (isActive !== undefined) user.isActive = isActive;
  if (vendorApproved !== undefined && user.role === 'vendor') user.vendorApproved = vendorApproved;
  await user.save();
  res.status(200).json({ success: true, user: user.toSafeJSON() });
});

export const getServiceAreas = asyncHandler(async (req, res) => {
  const areas = await ServiceArea.find().sort({ city: 1 });
  res.status(200).json({ success: true, items: areas });
});

export const createServiceArea = asyncHandler(async (req, res) => {
  const { city, state, pincodesServed } = req.body;
  const area = await ServiceArea.create({ city, state, pincodesServed: pincodesServed || [] });
  res.status(201).json({ success: true, area });
});

export const updateServiceArea = asyncHandler(async (req, res) => {
  const area = await ServiceArea.findById(req.params.id);
  if (!area) {
    res.status(404);
    throw new Error('Service area not found.');
  }
  const { isActive, pincodesServed } = req.body;
  if (isActive !== undefined) area.isActive = isActive;
  if (pincodesServed) area.pincodesServed = pincodesServed;
  await area.save();
  res.status(200).json({ success: true, area });
});

// Analytics: KPIs for admin dashboard
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    activeRentals,
    totalCustomers,
    totalVendors,
    totalProducts,
    pendingMaintenance,
    revenueAgg,
    statusBreakdown,
    monthlyTrend,
  ] = await Promise.all([
    RentalOrder.countDocuments({ status: 'active' }),
    User.countDocuments({ role: 'customer' }),
    User.countDocuments({ role: 'vendor' }),
    Product.countDocuments({}),
    MaintenanceRequest.countDocuments({ status: { $in: ['open', 'acknowledged', 'technician_assigned'] } }),
    RentalOrder.aggregate([
      { $match: { status: { $in: ['active', 'returned'] } } },
      { $group: { _id: null, mrr: { $sum: '$monthlyTotal' }, depositsHeld: { $sum: '$depositTotal' } } },
    ]),
    RentalOrder.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    RentalOrder.aggregate([
      {
        $group: {
          _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } },
          orders: { $sum: 1 },
          revenue: { $sum: '$monthlyTotal' },
        },
      },
      { $sort: { '_id.y': 1, '_id.m': 1 } },
      { $limit: 12 },
    ]),
  ]);

  const totalProductsAgg = await Product.aggregate([
    { $group: { _id: null, totalUnits: { $sum: '$totalUnits' }, availableUnits: { $sum: '$availableUnits' } } },
  ]);
  const util = totalProductsAgg[0]
    ? Math.round(
        ((totalProductsAgg[0].totalUnits - totalProductsAgg[0].availableUnits) /
          Math.max(totalProductsAgg[0].totalUnits, 1)) *
          100
      )
    : 0;

  res.status(200).json({
    success: true,
    stats: {
      activeRentals,
      totalCustomers,
      totalVendors,
      totalProducts,
      pendingMaintenance,
      monthlyRecurringRevenue: revenueAgg[0]?.mrr || 0,
      depositsHeld: revenueAgg[0]?.depositsHeld || 0,
      productUtilizationRate: util,
      statusBreakdown,
      monthlyTrend,
    },
  });
});
