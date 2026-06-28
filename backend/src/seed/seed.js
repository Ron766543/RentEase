import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../config/db.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import ServiceArea from '../models/ServiceArea.js';
import { slugify } from '../utils/helpers.js';

// Verified Unsplash photos, hotlinked directly (Unsplash License, free for commercial use).
const IMG = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

const PHOTOS = {
  bed: IMG('photo-1615529162924-f8605388461d'),
  sofa: IMG('photo-1565330502541-4937be8552e3'),
  studyTable: IMG('photo-1506188232657-23c9c893ac2b'),
  wardrobe: IMG('photo-1558997519-83ea9252edf8'),
  fridge: IMG('photo-1484154218962-a197022b5858'),
  washer: IMG('photo-1626806787461-102c1bfaaea1'),
  tv: IMG('photo-1521607630287-ee2e81ad3ced'),
  ac: IMG('photo-1544603396-e4a163c7c658'),
  microwave: IMG('photo-1630699144310-980c8ed310e3'),
  diningTable: IMG('photo-1722247520100-aa973c9f6d3b'),
  armchair: IMG('photo-1601366533287-5ee4c763ae4e'),
  bookshelf: IMG('photo-1593670755950-603e1d6184b9'),
  bunkBed: IMG('photo-1721743169043-dda0212ce3d4'),
};

const run = async () => {
  await connectDB();
  console.log('[seed] Clearing existing demo data...');
  await Promise.all([User.deleteMany({}), Product.deleteMany({}), ServiceArea.deleteMany({})]);

  console.log('[seed] Creating users...');
  const admin = await User.create({
    name: 'RentEase Admin',
    email: process.env.SEED_ADMIN_EMAIL || 'admin@rentease.com',
    password: process.env.SEED_ADMIN_PASSWORD || 'Admin@12345',
    role: 'admin',
    phone: '9000000000',
  });

  const vendorUrban = await User.create({
    name: 'Arjun Mehta',
    email: 'vendor@rentease.com',
    password: 'Vendor@12345',
    role: 'vendor',
    businessName: 'UrbanNest Rentals',
    serviceAreas: ['Bengaluru', 'Hyderabad', 'Pune', 'Mumbai'],
    vendorApproved: true,
    phone: '9123456780',
  });

  const vendorPremium = await User.create({
    name: 'Kavya Reddy',
    email: 'vendor2@rentease.com',
    password: 'Vendor@12345',
    role: 'vendor',
    businessName: 'Maison Premium Living',
    serviceAreas: ['Bengaluru', 'Mumbai', 'Delhi'],
    vendorApproved: true,
    phone: '9988776655',
  });

  const customer = await User.create({
    name: 'Priya Sharma',
    email: 'customer@rentease.com',
    password: 'Customer@12345',
    role: 'customer',
    phone: '9876543210',
    addresses: [
      {
        label: 'Home',
        line1: '4th Cross, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
        isDefault: true,
      },
    ],
  });

  console.log('[seed] Creating service areas...');
  await ServiceArea.insertMany([
    { city: 'Bengaluru', state: 'Karnataka', pincodesServed: ['560001', '560038', '560066'] },
    { city: 'Hyderabad', state: 'Telangana', pincodesServed: ['500001', '500032'] },
    { city: 'Pune', state: 'Maharashtra', pincodesServed: ['411001', '411045'] },
    { city: 'Mumbai', state: 'Maharashtra', pincodesServed: ['400001', '400050'] },
    { city: 'Delhi', state: 'Delhi', pincodesServed: ['110001', '110024'] },
  ]);

  console.log('[seed] Creating catalog...');
  const urbanAreas = ['Bengaluru', 'Hyderabad', 'Pune', 'Mumbai'];
  const premiumAreas = ['Bengaluru', 'Mumbai', 'Delhi'];

  const catalog = [
    {
      title: 'Single Bed with Storage — Student Edition',
      category: 'furniture',
      subCategory: 'bed',
      brand: 'WoodCraft Basics',
      description:
        'A compact single bed built for hostels and studio rentals. Under-bed storage keeps small rooms tidy, and the frame disassembles in minutes for your next move.',
      images: [PHOTOS.bed],
      securityDeposit: 1200,
      tenureOptions: [
        { months: 3, monthlyRent: 799, discountPercent: 0 },
        { months: 6, monthlyRent: 699, discountPercent: 13 },
        { months: 12, monthlyRent: 599, discountPercent: 25 },
      ],
      specs: [
        { label: 'Material', value: 'Engineered wood' },
        { label: 'Size', value: '36 x 75 inches' },
        { label: 'Storage', value: 'Under-bed drawer' },
      ],
      totalUnits: 14,
      condition: 'good',
      vendor: vendorUrban._id,
      serviceAreas: urbanAreas,
    },
    {
      title: 'Queen Size Wooden Bed with Hydraulic Storage',
      category: 'furniture',
      subCategory: 'bed',
      brand: 'WoodCraft',
      description:
        'Solid engineered wood queen bed with hydraulic storage, a sturdy upholstered headboard, and a smooth matte finish — built for couples setting up a first home together.',
      images: [PHOTOS.bed],
      securityDeposit: 2500,
      tenureOptions: [
        { months: 3, monthlyRent: 1499, discountPercent: 0 },
        { months: 6, monthlyRent: 1299, discountPercent: 13 },
        { months: 12, monthlyRent: 1099, discountPercent: 27 },
      ],
      specs: [
        { label: 'Material', value: 'Engineered wood' },
        { label: 'Size', value: '60 x 78 inches' },
        { label: 'Storage', value: 'Hydraulic lift-up' },
      ],
      totalUnits: 10,
      condition: 'like-new',
      vendor: vendorUrban._id,
      serviceAreas: urbanAreas,
    },
    {
      title: 'King Size Upholstered Bed — Premium Walnut Finish',
      category: 'furniture',
      subCategory: 'bed',
      brand: 'Maison Atelier',
      description:
        'A statement king bed in solid walnut veneer with a tall channel-tufted headboard. For renters who want a hotel-grade bedroom without buying outright.',
      images: [PHOTOS.bed],
      securityDeposit: 4500,
      tenureOptions: [
        { months: 3, monthlyRent: 2799, discountPercent: 0 },
        { months: 6, monthlyRent: 2399, discountPercent: 14 },
        { months: 12, monthlyRent: 1999, discountPercent: 29 },
      ],
      specs: [
        { label: 'Material', value: 'Walnut veneer, solid frame' },
        { label: 'Size', value: '72 x 78 inches' },
        { label: 'Headboard', value: 'Channel-tufted upholstery' },
      ],
      totalUnits: 4,
      condition: 'new',
      vendor: vendorPremium._id,
      serviceAreas: premiumAreas,
    },
    {
      title: 'Twin Bunk Bed — Kids & Shared Rooms',
      category: 'furniture',
      subCategory: 'bunk-bed',
      brand: 'WoodCraft',
      description:
        'Sturdy twin bunk bed with an integrated safety rail and ladder, designed for kids\u2019 rooms or shared flats where space is at a premium.',
      images: [PHOTOS.bunkBed],
      securityDeposit: 2200,
      tenureOptions: [
        { months: 3, monthlyRent: 1399, discountPercent: 0 },
        { months: 6, monthlyRent: 1199, discountPercent: 14 },
        { months: 12, monthlyRent: 999, discountPercent: 28 },
      ],
      specs: [
        { label: 'Material', value: 'Solid pine frame' },
        { label: 'Capacity', value: '2 sleepers' },
        { label: 'Safety', value: 'Integrated guard rail' },
      ],
      totalUnits: 6,
      condition: 'good',
      vendor: vendorUrban._id,
      serviceAreas: urbanAreas,
    },
    {
      title: '2-Seater Compact Sofa — Studio Apartment',
      category: 'furniture',
      subCategory: 'sofa',
      brand: 'ComfortLine',
      description:
        'A space-saving 2-seater sofa with durable fabric upholstery, built for studio apartments and first-time renters who need comfort without bulk.',
      images: [PHOTOS.sofa],
      securityDeposit: 1400,
      tenureOptions: [
        { months: 3, monthlyRent: 899, discountPercent: 0 },
        { months: 6, monthlyRent: 769, discountPercent: 14 },
        { months: 12, monthlyRent: 649, discountPercent: 28 },
      ],
      specs: [
        { label: 'Seating', value: '2 person' },
        { label: 'Upholstery', value: 'Stain-resistant fabric' },
      ],
      totalUnits: 9,
      condition: 'good',
      vendor: vendorUrban._id,
      serviceAreas: urbanAreas,
    },
    {
      title: '3-Seater Fabric Sofa',
      category: 'furniture',
      subCategory: 'sofa',
      brand: 'ComfortLine',
      description:
        'Plush 3-seater sofa with durable fabric upholstery and solid wood legs. Designed for compact living rooms and easy to move between homes.',
      images: [PHOTOS.sofa],
      securityDeposit: 2000,
      tenureOptions: [
        { months: 3, monthlyRent: 1299, discountPercent: 0 },
        { months: 6, monthlyRent: 1099, discountPercent: 15 },
        { months: 12, monthlyRent: 949, discountPercent: 27 },
      ],
      specs: [
        { label: 'Seating', value: '3 person' },
        { label: 'Upholstery', value: 'Premium fabric' },
      ],
      totalUnits: 8,
      condition: 'like-new',
      vendor: vendorUrban._id,
      serviceAreas: urbanAreas,
    },
    {
      title: 'L-Shaped Sectional Sofa — Family Living Room',
      category: 'furniture',
      subCategory: 'sofa',
      brand: 'Maison Atelier',
      description:
        'A generous L-shaped sectional built for family living rooms, with deep cushions and a reversible chaise — comfortably seats five.',
      images: [PHOTOS.sofa],
      securityDeposit: 3800,
      tenureOptions: [
        { months: 3, monthlyRent: 2299, discountPercent: 0 },
        { months: 6, monthlyRent: 1999, discountPercent: 13 },
        { months: 12, monthlyRent: 1699, discountPercent: 26 },
      ],
      specs: [
        { label: 'Seating', value: '5 person, L-shaped' },
        { label: 'Upholstery', value: 'Premium woven fabric' },
        { label: 'Configuration', value: 'Reversible chaise' },
      ],
      totalUnits: 5,
      condition: 'new',
      vendor: vendorPremium._id,
      serviceAreas: premiumAreas,
    },
    {
      title: 'Accent Armchair with Ottoman',
      category: 'furniture',
      subCategory: 'armchair',
      brand: 'ComfortLine',
      description:
        'A leather-finish accent armchair with a matching ottoman — perfect for a reading corner, home office, or as a second seat for couples.',
      images: [PHOTOS.armchair],
      securityDeposit: 1600,
      tenureOptions: [
        { months: 3, monthlyRent: 999, discountPercent: 0 },
        { months: 6, monthlyRent: 849, discountPercent: 15 },
        { months: 12, monthlyRent: 699, discountPercent: 30 },
      ],
      specs: [
        { label: 'Upholstery', value: 'Faux leather' },
        { label: 'Includes', value: 'Matching ottoman' },
      ],
      totalUnits: 7,
      condition: 'like-new',
      vendor: vendorPremium._id,
      serviceAreas: premiumAreas,
    },
    {
      title: 'Compact Study Table with Drawer',
      category: 'furniture',
      subCategory: 'table',
      brand: 'DeskPro',
      description:
        'Minimal study table with a built-in drawer, ideal for students and remote workers. Scratch-resistant laminate top fits into any small room.',
      images: [PHOTOS.studyTable],
      securityDeposit: 800,
      tenureOptions: [
        { months: 3, monthlyRent: 399, discountPercent: 0 },
        { months: 6, monthlyRent: 349, discountPercent: 12 },
        { months: 12, monthlyRent: 299, discountPercent: 25 },
      ],
      specs: [
        { label: 'Material', value: 'Engineered wood laminate' },
        { label: 'Dimensions', value: '36 x 20 x 30 inches' },
      ],
      totalUnits: 16,
      condition: 'good',
      vendor: vendorUrban._id,
      serviceAreas: urbanAreas,
    },
    {
      title: 'Work-From-Home Desk Setup',
      category: 'furniture',
      subCategory: 'table',
      brand: 'DeskPro',
      description:
        'A wider desk built for a full work-from-home setup — dual monitor width, cable routing, and a stable frame that won\u2019t wobble during video calls.',
      images: [PHOTOS.studyTable],
      securityDeposit: 1100,
      tenureOptions: [
        { months: 3, monthlyRent: 599, discountPercent: 0 },
        { months: 6, monthlyRent: 519, discountPercent: 13 },
        { months: 12, monthlyRent: 449, discountPercent: 25 },
      ],
      specs: [
        { label: 'Width', value: '55 inches' },
        { label: 'Cable management', value: 'Built-in routing channel' },
      ],
      totalUnits: 11,
      condition: 'like-new',
      vendor: vendorUrban._id,
      serviceAreas: urbanAreas,
    },
    {
      title: '6-Seater Dining Table Set',
      category: 'furniture',
      subCategory: 'dining-table',
      brand: 'Maison Atelier',
      description:
        'A solid wood 6-seater dining table with matching chairs, sized for family dinners and the occasional dinner party.',
      images: [PHOTOS.diningTable],
      securityDeposit: 3200,
      tenureOptions: [
        { months: 3, monthlyRent: 1899, discountPercent: 0 },
        { months: 6, monthlyRent: 1649, discountPercent: 13 },
        { months: 12, monthlyRent: 1399, discountPercent: 26 },
      ],
      specs: [
        { label: 'Seating', value: '6 person' },
        { label: 'Material', value: 'Solid sheesham wood' },
      ],
      totalUnits: 4,
      condition: 'new',
      vendor: vendorPremium._id,
      serviceAreas: premiumAreas,
    },
    {
      title: '4-Seater Dining Table Set',
      category: 'furniture',
      subCategory: 'dining-table',
      brand: 'ComfortLine',
      description:
        'A practical 4-seater dining set for couples and small families, with a stain-resistant tabletop and stackable chairs for easy moving.',
      images: [PHOTOS.diningTable],
      securityDeposit: 1900,
      tenureOptions: [
        { months: 3, monthlyRent: 1099, discountPercent: 0 },
        { months: 6, monthlyRent: 949, discountPercent: 14 },
        { months: 12, monthlyRent: 799, discountPercent: 27 },
      ],
      specs: [
        { label: 'Seating', value: '4 person' },
        { label: 'Material', value: 'Engineered wood, laminate top' },
      ],
      totalUnits: 7,
      condition: 'good',
      vendor: vendorUrban._id,
      serviceAreas: urbanAreas,
    },
    {
      title: '2-Door Wardrobe — Compact',
      category: 'furniture',
      subCategory: 'wardrobe',
      brand: 'WoodCraft Basics',
      description:
        'A space-efficient 2-door wardrobe for single rooms and studio apartments, with a hanging rail and two shelves.',
      images: [PHOTOS.wardrobe],
      securityDeposit: 1300,
      tenureOptions: [
        { months: 3, monthlyRent: 749, discountPercent: 0 },
        { months: 6, monthlyRent: 649, discountPercent: 13 },
        { months: 12, monthlyRent: 549, discountPercent: 27 },
      ],
      specs: [
        { label: 'Doors', value: '2' },
        { label: 'Shelves', value: '2 + hanging rail' },
      ],
      totalUnits: 9,
      condition: 'good',
      vendor: vendorUrban._id,
      serviceAreas: urbanAreas,
    },
    {
      title: '3-Door Wardrobe with Mirror',
      category: 'furniture',
      subCategory: 'wardrobe',
      brand: 'WoodCraft',
      description:
        'Spacious 3-door wardrobe with a full-length mirror, hanging space, and multiple shelves for organized storage — built for couples and families.',
      images: [PHOTOS.wardrobe],
      securityDeposit: 2000,
      tenureOptions: [
        { months: 3, monthlyRent: 1199, discountPercent: 0 },
        { months: 6, monthlyRent: 1049, discountPercent: 13 },
        { months: 12, monthlyRent: 899, discountPercent: 25 },
      ],
      specs: [
        { label: 'Doors', value: '3' },
        { label: 'Mirror', value: 'Full length, 1 door' },
      ],
      totalUnits: 6,
      condition: 'like-new',
      vendor: vendorUrban._id,
      serviceAreas: urbanAreas,
    },
    {
      title: 'Compact Bookshelf — 5 Tier',
      category: 'furniture',
      subCategory: 'bookshelf',
      brand: 'DeskPro',
      description:
        'A tall 5-tier bookshelf for students and book lovers, narrow enough to fit beside a desk or bed.',
      images: [PHOTOS.bookshelf],
      securityDeposit: 600,
      tenureOptions: [
        { months: 3, monthlyRent: 349, discountPercent: 0 },
        { months: 6, monthlyRent: 299, discountPercent: 14 },
        { months: 12, monthlyRent: 249, discountPercent: 29 },
      ],
      specs: [
        { label: 'Tiers', value: '5' },
        { label: 'Material', value: 'Engineered wood' },
      ],
      totalUnits: 13,
      condition: 'good',
      vendor: vendorUrban._id,
      serviceAreas: urbanAreas,
    },
    {
      title: '190L Single Door Refrigerator',
      category: 'appliances',
      subCategory: 'fridge',
      brand: 'CoolTech',
      description:
        'Energy-efficient single door refrigerator with direct cool technology, ideal for individuals and small families.',
      images: [PHOTOS.fridge],
      securityDeposit: 1800,
      tenureOptions: [
        { months: 3, monthlyRent: 899, discountPercent: 0 },
        { months: 6, monthlyRent: 799, discountPercent: 11 },
        { months: 12, monthlyRent: 699, discountPercent: 22 },
      ],
      specs: [
        { label: 'Capacity', value: '190 Litres' },
        { label: 'Star rating', value: '3 Star' },
        { label: 'Type', value: 'Direct cool' },
      ],
      totalUnits: 12,
      condition: 'good',
      vendor: vendorUrban._id,
      serviceAreas: urbanAreas,
    },
    {
      title: '340L Double Door Frost-Free Refrigerator',
      category: 'appliances',
      subCategory: 'fridge',
      brand: 'CoolTech Pro',
      description:
        'A family-size double door refrigerator with frost-free cooling and a dedicated vegetable crisper — built for households of four or more.',
      images: [PHOTOS.fridge],
      securityDeposit: 3200,
      tenureOptions: [
        { months: 3, monthlyRent: 1699, discountPercent: 0 },
        { months: 6, monthlyRent: 1449, discountPercent: 15 },
        { months: 12, monthlyRent: 1249, discountPercent: 26 },
      ],
      specs: [
        { label: 'Capacity', value: '340 Litres' },
        { label: 'Star rating', value: '4 Star' },
        { label: 'Type', value: 'Frost-free, double door' },
      ],
      totalUnits: 6,
      condition: 'new',
      vendor: vendorPremium._id,
      serviceAreas: premiumAreas,
    },
    {
      title: '6.5kg Front Load Washing Machine',
      category: 'appliances',
      subCategory: 'washing-machine',
      brand: 'SpinWash',
      description:
        'Fully automatic front load washing machine with multiple wash programs and an in-built heater for deep cleaning.',
      images: [PHOTOS.washer],
      securityDeposit: 2200,
      tenureOptions: [
        { months: 3, monthlyRent: 1099, discountPercent: 0 },
        { months: 6, monthlyRent: 949, discountPercent: 14 },
        { months: 12, monthlyRent: 849, discountPercent: 23 },
      ],
      specs: [
        { label: 'Capacity', value: '6.5 kg' },
        { label: 'Type', value: 'Front load, fully automatic' },
      ],
      totalUnits: 9,
      condition: 'like-new',
      vendor: vendorUrban._id,
      serviceAreas: urbanAreas,
    },
    {
      title: '6kg Top Load Washing Machine — Budget',
      category: 'appliances',
      subCategory: 'washing-machine',
      brand: 'SpinWash Basics',
      description:
        'An affordable, no-fuss top load washing machine for solo renters and shared flats. Simple dial controls, no learning curve.',
      images: [PHOTOS.washer],
      securityDeposit: 1400,
      tenureOptions: [
        { months: 3, monthlyRent: 649, discountPercent: 0 },
        { months: 6, monthlyRent: 559, discountPercent: 14 },
        { months: 12, monthlyRent: 479, discountPercent: 26 },
      ],
      specs: [
        { label: 'Capacity', value: '6 kg' },
        { label: 'Type', value: 'Top load, semi-automatic' },
      ],
      totalUnits: 10,
      condition: 'fair',
      vendor: vendorUrban._id,
      serviceAreas: urbanAreas,
    },
    {
      title: '9kg Front Load Washing Machine — Family Size',
      category: 'appliances',
      subCategory: 'washing-machine',
      brand: 'SpinWash Pro',
      description:
        'A high-capacity front loader built for family laundry loads, with steam wash and an inverter motor for quieter, more efficient cycles.',
      images: [PHOTOS.washer],
      securityDeposit: 3000,
      tenureOptions: [
        { months: 3, monthlyRent: 1599, discountPercent: 0 },
        { months: 6, monthlyRent: 1399, discountPercent: 13 },
        { months: 12, monthlyRent: 1199, discountPercent: 25 },
      ],
      specs: [
        { label: 'Capacity', value: '9 kg' },
        { label: 'Motor', value: 'Inverter, steam wash' },
      ],
      totalUnits: 5,
      condition: 'new',
      vendor: vendorPremium._id,
      serviceAreas: premiumAreas,
    },
    {
      title: '32-inch HD Smart TV — Compact',
      category: 'appliances',
      subCategory: 'tv',
      brand: 'VisionMax',
      description:
        'A compact 32-inch smart TV for bedrooms, studio apartments, or as a second screen — with built-in streaming apps out of the box.',
      images: [PHOTOS.tv],
      securityDeposit: 900,
      tenureOptions: [
        { months: 3, monthlyRent: 499, discountPercent: 0 },
        { months: 6, monthlyRent: 429, discountPercent: 14 },
        { months: 12, monthlyRent: 369, discountPercent: 26 },
      ],
      specs: [
        { label: 'Screen size', value: '32 inch' },
        { label: 'Resolution', value: 'HD' },
      ],
      totalUnits: 11,
      condition: 'good',
      vendor: vendorUrban._id,
      serviceAreas: urbanAreas,
    },
    {
      title: '43-inch Smart LED TV',
      category: 'appliances',
      subCategory: 'tv',
      brand: 'VisionMax',
      description:
        'Full HD smart LED television with built-in streaming apps and voice remote, perfect for shared accommodation or studio apartments.',
      images: [PHOTOS.tv],
      securityDeposit: 1500,
      tenureOptions: [
        { months: 3, monthlyRent: 799, discountPercent: 0 },
        { months: 6, monthlyRent: 699, discountPercent: 12 },
        { months: 12, monthlyRent: 599, discountPercent: 25 },
      ],
      specs: [
        { label: 'Screen size', value: '43 inch' },
        { label: 'Resolution', value: 'Full HD' },
        { label: 'Smart features', value: 'Built-in streaming apps' },
      ],
      totalUnits: 10,
      condition: 'like-new',
      vendor: vendorUrban._id,
      serviceAreas: urbanAreas,
    },
    {
      title: '55-inch 4K Smart TV — Premium',
      category: 'appliances',
      subCategory: 'tv',
      brand: 'VisionMax Ultra',
      description:
        'A 55-inch 4K HDR smart TV for living rooms that double as a home theatre, with Dolby audio support and all major streaming apps pre-installed.',
      images: [PHOTOS.tv],
      securityDeposit: 3500,
      tenureOptions: [
        { months: 3, monthlyRent: 1999, discountPercent: 0 },
        { months: 6, monthlyRent: 1749, discountPercent: 13 },
        { months: 12, monthlyRent: 1499, discountPercent: 25 },
      ],
      specs: [
        { label: 'Screen size', value: '55 inch' },
        { label: 'Resolution', value: '4K HDR' },
        { label: 'Audio', value: 'Dolby Audio support' },
      ],
      totalUnits: 4,
      condition: 'new',
      vendor: vendorPremium._id,
      serviceAreas: premiumAreas,
    },
    {
      title: '0.75 Ton Window AC — Budget Cooling',
      category: 'appliances',
      subCategory: 'ac',
      brand: 'ChillAir Basics',
      description:
        'An affordable window AC for single rooms, with manual controls and reliable cooling for compact spaces.',
      images: [PHOTOS.ac],
      securityDeposit: 1900,
      tenureOptions: [
        { months: 3, monthlyRent: 999, discountPercent: 0 },
        { months: 6, monthlyRent: 869, discountPercent: 13 },
        { months: 12, monthlyRent: 749, discountPercent: 25 },
      ],
      specs: [
        { label: 'Capacity', value: '0.75 Ton' },
        { label: 'Type', value: 'Window AC' },
        { label: 'Star rating', value: '3 Star' },
      ],
      totalUnits: 8,
      condition: 'fair',
      vendor: vendorUrban._id,
      serviceAreas: urbanAreas,
    },
    {
      title: '1 Ton Split Air Conditioner',
      category: 'appliances',
      subCategory: 'ac',
      brand: 'ChillAir',
      description:
        'Inverter split AC with fast cooling, low noise operation, and standard installation kit included.',
      images: [PHOTOS.ac],
      securityDeposit: 2800,
      tenureOptions: [
        { months: 3, monthlyRent: 1599, discountPercent: 0 },
        { months: 6, monthlyRent: 1399, discountPercent: 13 },
        { months: 12, monthlyRent: 1199, discountPercent: 25 },
      ],
      specs: [
        { label: 'Capacity', value: '1 Ton' },
        { label: 'Type', value: 'Inverter split AC' },
        { label: 'Star rating', value: '4 Star' },
      ],
      totalUnits: 9,
      condition: 'like-new',
      vendor: vendorUrban._id,
      serviceAreas: urbanAreas,
    },
    {
      title: '1.5 Ton Split AC — Premium 5 Star',
      category: 'appliances',
      subCategory: 'ac',
      brand: 'ChillAir Pro',
      description:
        'A high-efficiency 5-star split AC for larger living rooms and master bedrooms, with a quiet inverter compressor and app-based control.',
      images: [PHOTOS.ac],
      securityDeposit: 4200,
      tenureOptions: [
        { months: 3, monthlyRent: 2399, discountPercent: 0 },
        { months: 6, monthlyRent: 2099, discountPercent: 13 },
        { months: 12, monthlyRent: 1799, discountPercent: 25 },
      ],
      specs: [
        { label: 'Capacity', value: '1.5 Ton' },
        { label: 'Star rating', value: '5 Star' },
        { label: 'Control', value: 'Wi-Fi app control' },
      ],
      totalUnits: 4,
      condition: 'new',
      vendor: vendorPremium._id,
      serviceAreas: premiumAreas,
    },
    {
      title: '20L Solo Microwave — Compact',
      category: 'appliances',
      subCategory: 'microwave',
      brand: 'QuickHeat',
      description:
        'A compact 20-litre solo microwave for reheating and basic cooking — fits easily on a small kitchen counter.',
      images: [PHOTOS.microwave],
      securityDeposit: 700,
      tenureOptions: [
        { months: 3, monthlyRent: 399, discountPercent: 0 },
        { months: 6, monthlyRent: 349, discountPercent: 13 },
        { months: 12, monthlyRent: 299, discountPercent: 25 },
      ],
      specs: [
        { label: 'Capacity', value: '20 Litres' },
        { label: 'Type', value: 'Solo microwave' },
      ],
      totalUnits: 12,
      condition: 'good',
      vendor: vendorUrban._id,
      serviceAreas: urbanAreas,
    },
    {
      title: '32L Convection Microwave — Family',
      category: 'appliances',
      subCategory: 'microwave',
      brand: 'QuickHeat Pro',
      description:
        'A 32-litre convection microwave that bakes, grills, and reheats — sized for family kitchens that need more than just reheating.',
      images: [PHOTOS.microwave],
      securityDeposit: 1500,
      tenureOptions: [
        { months: 3, monthlyRent: 849, discountPercent: 0 },
        { months: 6, monthlyRent: 729, discountPercent: 14 },
        { months: 12, monthlyRent: 629, discountPercent: 26 },
      ],
      specs: [
        { label: 'Capacity', value: '32 Litres' },
        { label: 'Type', value: 'Convection + grill' },
      ],
      totalUnits: 6,
      condition: 'like-new',
      vendor: vendorPremium._id,
      serviceAreas: premiumAreas,
    },
  ];

  // Recompute discountPercent from real prices so it can't drift from what customers see.
  const withComputedDiscounts = (tenureOptions) => {
    const sorted = [...tenureOptions].sort((a, b) => a.months - b.months);
    const baseline = sorted[0]?.monthlyRent || 0;
    return sorted.map((t, i) => ({
      ...t,
      discountPercent:
        i === 0 || baseline <= 0 ? 0 : Math.round(((baseline - t.monthlyRent) / baseline) * 100),
    }));
  };

  for (const item of catalog) {
    const slug = slugify(item.title);
    await Product.create({
      ...item,
      tenureOptions: withComputedDiscounts(item.tenureOptions),
      slug,
      availableUnits: item.totalUnits,
    });
  }

  console.log(`[seed] Created ${catalog.length} products across ${urbanAreas.length + 1} cities.`);
  console.log('[seed] Done.');
  console.log('-----------------------------------');
  console.log('Admin     ->', admin.email, '/', process.env.SEED_ADMIN_PASSWORD || 'Admin@12345');
  console.log('Vendor 1  ->', vendorUrban.email, '/ Vendor@12345');
  console.log('Vendor 2  ->', vendorPremium.email, '/ Vendor@12345');
  console.log('Customer  ->', customer.email, '/ Customer@12345');
  console.log('-----------------------------------');
  process.exit(0);
};

run().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
