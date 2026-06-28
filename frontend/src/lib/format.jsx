export const formatINR = (amount) => {
  const value = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatDate = (date) => {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
};

export const formatDateTime = (date) => {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
};

export const STATUS_LABELS = {
  pending_confirmation: 'Pending confirmation',
  confirmed: 'Confirmed',
  out_for_delivery: 'Out for delivery',
  active: 'Active rental',
  return_scheduled: 'Return scheduled',
  returned: 'Returned',
  cancelled: 'Cancelled',
};

export const STATUS_COLORS = {
  pending_confirmation: 'bg-amber-100 text-amber-600',
  confirmed: 'bg-sage-100 text-sage-700',
  out_for_delivery: 'bg-sage-100 text-sage-700',
  active: 'bg-sage-600 text-paper',
  return_scheduled: 'bg-amber-100 text-amber-600',
  returned: 'bg-ink/10 text-mist',
  cancelled: 'bg-red-100 text-red-700',
};

export const CATEGORY_LABELS = {
  furniture: 'Furniture',
  appliances: 'Appliances',
};

export const SUBCATEGORY_LABELS = {
  bed: 'Bed',
  sofa: 'Sofa',
  table: 'Study table',
  wardrobe: 'Wardrobe',
  'dining-table': 'Dining table',
  armchair: 'Armchair / recliner',
  bookshelf: 'Bookshelf',
  'bunk-bed': 'Bunk bed',
  fridge: 'Refrigerator',
  'washing-machine': 'Washing machine',
  tv: 'Television',
  ac: 'Air conditioner',
  microwave: 'Microwave',
};
