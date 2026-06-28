import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import RentalOrder from '../models/RentalOrder.js';
import Product from '../models/Product.js';
import { generateOrderNumber } from '../utils/helpers.js';

// Confirms the requesting vendor actually owns at least one item in the
// order before letting them act on it. Admins always pass.
const vendorOwnsOrder = async (order, user) => {
  if (user.role === 'admin') return true;
  const productIds = order.items.map((i) => i.product);
  const ownedCount = await Product.countDocuments({
    _id: { $in: productIds },
    vendor: user._id,
  });
  return ownedCount > 0;
};

// Customer: create a rental order (checkout)
export const createOrder = asyncHandler(async (req, res) => {
  const { items, deliveryAddress, deliveryDate, deliverySlot, paymentMethod, notes } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error('Cart is empty. Add at least one item.');
  }
  if (!deliveryAddress?.city || !deliveryDate) {
    res.status(400);
    throw new Error('Delivery address and date are required.');
  }

  // Validates stock/tenure and builds order items; uses a transaction when available.
  const buildOrder = async (sessionOpt) => {
    const orderItems = [];
    let monthlyTotal = 0;
    let depositTotal = 0;

    for (const cartItem of items) {
      const query = Product.findById(cartItem.productId);
      if (sessionOpt) query.session(sessionOpt);
      const product = await query;

      if (!product || !product.isPublished) {
        throw new Error(`Product unavailable: ${cartItem.productId}`);
      }

      const qty = cartItem.quantity || 1;
      if (product.availableUnits < qty) {
        throw new Error(`Not enough stock for "${product.title}". Only ${product.availableUnits} left.`);
      }

      const tenure = product.tenureOptions.find((t) => t.months === cartItem.tenureMonths);
      if (!tenure) {
        throw new Error(`Invalid tenure selected for "${product.title}".`);
      }

      product.availableUnits -= qty;
      await product.save(sessionOpt ? { session: sessionOpt } : undefined);

      orderItems.push({
        product: product._id,
        title: product.title,
        image: product.images?.[0] || '',
        tenureMonths: tenure.months,
        monthlyRent: tenure.monthlyRent,
        securityDeposit: product.securityDeposit,
        quantity: qty,
      });

      monthlyTotal += tenure.monthlyRent * qty;
      depositTotal += product.securityDeposit * qty;
    }

    const order = new RentalOrder({
      orderNumber: generateOrderNumber(),
      customer: req.user._id,
      items: orderItems,
      deliveryAddress,
      deliveryDate,
      deliverySlot: deliverySlot || 'morning',
      monthlyTotal,
      depositTotal,
      grandTotalFirstPayment: monthlyTotal + depositTotal,
      paymentMethod: paymentMethod || 'cash_on_delivery',
      notes: notes || '',
      statusHistory: [{ status: 'pending_confirmation', note: 'Order placed by customer.' }],
    });

    await order.save(sessionOpt ? { session: sessionOpt } : undefined);
    return order;
  };

  let createdOrder;
  try {
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        createdOrder = await buildOrder(session);
      });
    } finally {
      session.endSession();
    }
  } catch (txError) {
    // Standalone MongoDB has no replica set, so transactions aren't available.
    const unsupported = /Transaction numbers|replica set|IllegalOperation/i.test(txError.message || '');
    if (!unsupported) throw txError;
    createdOrder = await buildOrder(null);
  }

  res.status(201).json({ success: true, order: createdOrder });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await RentalOrder.find({ customer: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, items: orders });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await RentalOrder.findById(req.params.id).populate(
    'items.product',
    'title images vendor'
  );
  if (!order) {
    res.status(404);
    throw new Error('Order not found.');
  }

  const isOwner = order.customer.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';
  if (!isOwner && !isAdmin) {
    // vendors may view if they own at least one item in the order
    const vendorOwnsItem = order.items.some(
      (it) => it.product?.vendor?.toString() === req.user._id.toString()
    );
    if (!vendorOwnsItem) {
      res.status(403);
      throw new Error('You do not have permission to view this order.');
    }
  }

  res.status(200).json({ success: true, order });
});

// Customer: request return / pickup
export const requestPickup = asyncHandler(async (req, res) => {
  const order = await RentalOrder.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found.');
  }
  if (order.customer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You do not have permission to modify this order.');
  }
  if (!['active', 'confirmed', 'out_for_delivery'].includes(order.status)) {
    res.status(400);
    throw new Error('Pickup can only be requested for active rentals.');
  }

  const { pickupDate, pickupSlot } = req.body;
  order.pickupRequested = true;
  order.pickupDate = pickupDate;
  order.pickupSlot = pickupSlot || 'morning';
  order.status = 'return_scheduled';
  order.statusHistory.push({ status: 'return_scheduled', note: 'Pickup requested by customer.' });

  await order.save();
  res.status(200).json({ success: true, order });
});

// Customer: request tenure extension
export const requestExtension = asyncHandler(async (req, res) => {
  const order = await RentalOrder.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found.');
  }
  if (order.customer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You do not have permission to modify this order.');
  }
  const { extraMonths } = req.body;
  if (!extraMonths || extraMonths < 1) {
    res.status(400);
    throw new Error('Provide a valid number of months to extend.');
  }

  order.extensionMonths += extraMonths;
  if (order.rentalEndDate) {
    const newEnd = new Date(order.rentalEndDate);
    newEnd.setMonth(newEnd.getMonth() + extraMonths);
    order.rentalEndDate = newEnd;
  }
  order.statusHistory.push({
    status: order.status,
    note: `Customer extended rental by ${extraMonths} month(s).`,
  });

  await order.save();
  res.status(200).json({ success: true, order });
});

// Vendor/Admin: update order status (confirm, dispatch, mark active/returned, etc.)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await RentalOrder.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found.');
  }

  if (!(await vendorOwnsOrder(order, req.user))) {
    res.status(403);
    throw new Error('You do not have permission to update this order.');
  }

  const { status, note } = req.body;
  const validStatuses = [
    'pending_confirmation', 'confirmed', 'out_for_delivery', 'active',
    'return_scheduled', 'returned', 'cancelled',
  ];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status value.');
  }

  const previousStatus = order.status;
  order.status = status;

  if (status === 'active' && !order.rentalStartDate) {
    order.rentalStartDate = new Date();
    const tenureMonths = Math.max(...order.items.map((i) => i.tenureMonths));
    const end = new Date();
    end.setMonth(end.getMonth() + tenureMonths);
    order.rentalEndDate = end;
  }

  // Release reserved inventory exactly once, on the transition into returned/cancelled.
  const releasesInventory = status === 'returned' || status === 'cancelled';
  if (releasesInventory && previousStatus !== status) {
    if (status === 'returned') order.actualReturnDate = new Date();
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { availableUnits: item.quantity },
      });
    }
  }

  order.statusHistory.push({ status, note: note || `Status updated to ${status}.` });
  await order.save();

  res.status(200).json({ success: true, order });
});

// Vendor/Admin: report damage on return
export const reportDamage = asyncHandler(async (req, res) => {
  const order = await RentalOrder.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found.');
  }

  if (!(await vendorOwnsOrder(order, req.user))) {
    res.status(403);
    throw new Error('You do not have permission to update this order.');
  }
  const { damageNotes, damageCharge } = req.body;
  order.damageReported = true;
  order.damageNotes = damageNotes || '';
  order.damageCharge = damageCharge || 0;
  order.statusHistory.push({ status: order.status, note: 'Damage reported by vendor/admin.' });
  await order.save();
  res.status(200).json({ success: true, order });
});

// Vendor: list orders containing their products
export const getVendorOrders = asyncHandler(async (req, res) => {
  const orders = await RentalOrder.find({})
    .populate({ path: 'items.product', select: 'title vendor' })
    .sort({ createdAt: -1 });

  const vendorId = req.user._id.toString();
  const filtered = orders.filter((order) =>
    order.items.some((it) => it.product?.vendor?.toString() === vendorId)
  );

  res.status(200).json({ success: true, items: filtered });
});

// Admin: list all orders with pagination
export const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.status = status;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));

  const [items, total] = await Promise.all([
    RentalOrder.find(query)
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    RentalOrder.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    items,
    pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) || 1 },
  });
});
