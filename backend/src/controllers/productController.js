import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import { slugify } from '../utils/helpers.js';

// Public: list products with filters, search, pagination
export const getProducts = asyncHandler(async (req, res) => {
  const {
    category,
    subCategory,
    city,
    search,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    limit = 12,
  } = req.query;

  const query = { isPublished: true };

  if (category) query.category = category;
  if (subCategory) query.subCategory = subCategory;
  if (city) query.serviceAreas = { $in: [city] };
  if (search) query.$text = { $search: search };

  if (minPrice || maxPrice) {
    query['tenureOptions.monthlyRent'] = {};
    if (minPrice) query['tenureOptions.monthlyRent'].$gte = Number(minPrice);
    if (maxPrice) query['tenureOptions.monthlyRent'].$lte = Number(maxPrice);
  }

  const sortMap = {
    newest: { createdAt: -1 },
    price_low: { 'tenureOptions.0.monthlyRent': 1 },
    price_high: { 'tenureOptions.0.monthlyRent': -1 },
    rating: { ratingAverage: -1 },
  };
  const sortBy = sortMap[sort] || sortMap.newest;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(48, Math.max(1, Number(limit)));

  const [items, total] = await Promise.all([
    Product.find(query)
      .sort(sortBy)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate('vendor', 'name businessName'),
    Product.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    items,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  });
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate(
    'vendor',
    'name businessName'
  );
  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }
  res.status(200).json({ success: true, product });
});

export const getCategoryFacets = asyncHandler(async (req, res) => {
  const facets = await Product.aggregate([
    { $match: { isPublished: true } },
    {
      $group: {
        _id: { category: '$category', subCategory: '$subCategory' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.category': 1, '_id.subCategory': 1 } },
  ]);
  res.status(200).json({ success: true, facets });
});

// Vendor: create product
export const createProduct = asyncHandler(async (req, res) => {
  const body = req.body;
  const baseSlug = slugify(body.title);
  let slug = baseSlug;
  let suffix = 1;
  while (await Product.findOne({ slug })) {
    slug = `${baseSlug}-${suffix++}`;
  }

  if (!Array.isArray(body.tenureOptions) || body.tenureOptions.length === 0) {
    res.status(400);
    throw new Error('At least one tenure option is required.');
  }

  const product = await Product.create({
    ...body,
    slug,
    vendor: req.user._id,
    availableUnits: body.totalUnits ?? 1,
  });

  res.status(201).json({ success: true, product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }
  if (product.vendor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('You do not have permission to edit this product.');
  }

  const fields = [
    'title', 'description', 'category', 'subCategory', 'brand', 'images',
    'securityDeposit', 'tenureOptions', 'specs', 'condition', 'serviceAreas',
    'totalUnits', 'availableUnits', 'isPublished',
  ];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) product[f] = req.body[f];
  });

  await product.save();
  res.status(200).json({ success: true, product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }
  if (product.vendor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('You do not have permission to delete this product.');
  }
  await product.deleteOne();
  res.status(200).json({ success: true, message: 'Product removed.' });
});

export const getVendorProducts = asyncHandler(async (req, res) => {
  const vendorId = req.user.role === 'admin' && req.query.vendorId ? req.query.vendorId : req.user._id;
  const products = await Product.find({ vendor: vendorId }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, items: products });
});
