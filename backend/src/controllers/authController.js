import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { signToken, cookieOptions } from '../utils/token.js';

const sendAuthResponse = (res, statusCode, user) => {
  const token = signToken(user._id, user.role);
  const cookieName = process.env.COOKIE_NAME || 'rentease_token';
  res.cookie(cookieName, token, cookieOptions());
  res.status(statusCode).json({
    success: true,
    user: user.toSafeJSON(),
    token, // also returned for clients that prefer header-based auth
  });
};

export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map((e) => e.msg).join(', '));
  }

  const { name, email, password, phone, role, businessName, serviceAreas } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(409);
    throw new Error('An account with this email already exists.');
  }

  const allowedRole = role === 'vendor' ? 'vendor' : 'customer';

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: allowedRole,
    businessName: allowedRole === 'vendor' ? businessName : undefined,
    serviceAreas: allowedRole === 'vendor' ? serviceAreas || [] : [],
    vendorApproved: allowedRole === 'vendor' ? false : undefined,
  });

  sendAuthResponse(res, 201, user);
});

export const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map((e) => e.msg).join(', '));
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password.');
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error('This account has been deactivated. Contact support.');
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  sendAuthResponse(res, 200, user);
});

export const logout = asyncHandler(async (req, res) => {
  const cookieName = process.env.COOKIE_NAME || 'rentease_token';
  res.clearCookie(cookieName, { ...cookieOptions(), maxAge: 0 });
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user.toSafeJSON() });
});

export const updateMe = asyncHandler(async (req, res) => {
  const { name, phone, businessName, serviceAreas } = req.body;
  const user = req.user;

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (user.role === 'vendor') {
    if (businessName) user.businessName = businessName;
    if (serviceAreas) user.serviceAreas = serviceAreas;
  }

  await user.save();
  res.status(200).json({ success: true, user: user.toSafeJSON() });
});

export const addAddress = asyncHandler(async (req, res) => {
  const { label, line1, line2, city, state, pincode, isDefault } = req.body;
  if (!line1 || !city || !state || !pincode) {
    res.status(400);
    throw new Error('line1, city, state, and pincode are required.');
  }

  if (isDefault) {
    req.user.addresses.forEach((a) => {
      a.isDefault = false;
    });
  }

  req.user.addresses.push({ label, line1, line2, city, state, pincode, isDefault: !!isDefault });
  await req.user.save();
  res.status(201).json({ success: true, addresses: req.user.addresses });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  req.user.addresses = req.user.addresses.filter(
    (a) => a._id.toString() !== req.params.addressId
  );
  await req.user.save();
  res.status(200).json({ success: true, addresses: req.user.addresses });
});
