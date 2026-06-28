import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MapPin, Calendar } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLocationContext } from '../../context/LocationContext.jsx';
import { formatINR } from '../../lib/format.jsx';
import api from '../../lib/api.jsx';

const todayPlus = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

const Checkout = () => {
  const { items, clearCart, monthlyTotal: getMonthlyTotal, depositTotal: getDepositTotal } = useCart();
  const monthlyTotal = getMonthlyTotal();
  const depositTotal = getDepositTotal();
  const { user } = useAuth();
  const { city: globalCity } = useLocationContext();
  const navigate = useNavigate();

  const defaultAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];

  const [form, setForm] = useState({
    line1: defaultAddress?.line1 || '',
    line2: defaultAddress?.line2 || '',
    city: defaultAddress?.city || globalCity || '',
    state: defaultAddress?.state || '',
    pincode: defaultAddress?.pincode || '',
    deliveryDate: todayPlus(2),
    deliverySlot: 'morning',
    paymentMethod: 'cash_on_delivery',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.line1 || !form.city || !form.state || !form.pincode) {
      setError('Please fill in your full delivery address.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.productId,
          tenureMonths: i.tenureMonths,
          quantity: i.quantity,
        })),
        deliveryAddress: {
          line1: form.line1,
          line2: form.line2,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
        deliveryDate: form.deliveryDate,
        deliverySlot: form.deliverySlot,
        paymentMethod: form.paymentMethod,
        notes: form.notes,
      };
      const { data } = await api.post('/orders', payload);
      clearCart();
      toast.success('Order placed successfully');
      navigate(`/account/orders/${data.order._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (items.length === 0) navigate('/cart');
  }, [items.length, navigate]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="container-page py-8">
      <h1 className="font-display text-2xl font-semibold text-ink mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        <div className="space-y-6">
          <div className="card p-5">
            <h2 className="font-display font-semibold text-ink mb-4 flex items-center gap-2">
              <MapPin size={17} className="text-sage-600" /> Delivery address
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="sm:col-span-2">
                <label className="label">Address line 1</label>
                <input className="input" value={form.line1} onChange={(e) => set({ line1: e.target.value })} required />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Address line 2 (optional)</label>
                <input className="input" value={form.line2} onChange={(e) => set({ line2: e.target.value })} />
              </div>
              <div>
                <label className="label">City</label>
                <input className="input" value={form.city} onChange={(e) => set({ city: e.target.value })} required />
              </div>
              <div>
                <label className="label">State</label>
                <input className="input" value={form.state} onChange={(e) => set({ state: e.target.value })} required />
              </div>
              <div>
                <label className="label">Pincode</label>
                <input className="input" value={form.pincode} onChange={(e) => set({ pincode: e.target.value })} required />
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="font-display font-semibold text-ink mb-4 flex items-center gap-2">
              <Calendar size={17} className="text-sage-600" /> Delivery schedule
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="label">Delivery date</label>
                <input
                  type="date"
                  className="input"
                  min={todayPlus(1)}
                  value={form.deliveryDate}
                  onChange={(e) => set({ deliveryDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Time slot</label>
                <select className="input" value={form.deliverySlot} onChange={(e) => set({ deliverySlot: e.target.value })}>
                  <option value="morning">Morning (9am – 12pm)</option>
                  <option value="afternoon">Afternoon (12pm – 4pm)</option>
                  <option value="evening">Evening (4pm – 8pm)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="font-display font-semibold text-ink mb-4">Payment method</h2>
            <div className="space-y-2">
              {[
                { value: 'cash_on_delivery', label: 'Cash on delivery' },
                { value: 'upi', label: 'UPI' },
                { value: 'card', label: 'Credit / Debit card' },
                { value: 'netbanking', label: 'Net banking' },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2.5 rounded border border-ink/10 px-3.5 py-2.5 cursor-pointer hover:bg-ink/5">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={form.paymentMethod === opt.value}
                    onChange={() => set({ paymentMethod: opt.value })}
                    className="accent-sage-600"
                  />
                  <span className="text-sm text-ink">{opt.label}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-mist mt-3">
              Online payment gateway integration is a future enhancement — orders are confirmed and billed offline for now.
            </p>
          </div>

          <div className="card p-5">
            <label className="label">Notes for delivery (optional)</label>
            <textarea
              className="input"
              rows={3}
              value={form.notes}
              onChange={(e) => set({ notes: e.target.value })}
              placeholder="E.g. gate code, landmark, preferred contact number"
            />
          </div>
        </div>

        <div className="card p-5 h-fit">
          <h2 className="font-display font-semibold text-ink mb-4">Order summary</h2>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 mb-4">
            {items.map((item) => (
              <div key={`${item.productId}-${item.tenureMonths}`} className="flex justify-between text-sm">
                <span className="text-ink/70 line-clamp-1">{item.title} × {item.quantity}</span>
                <span className="font-mono text-ink shrink-0 ml-2">{formatINR(item.monthlyRent * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2.5 text-sm border-t border-ink/8 pt-3">
            <div className="flex justify-between text-ink/70">
              <span>Monthly rent total</span>
              <span className="font-mono font-medium text-ink">{formatINR(monthlyTotal)}</span>
            </div>
            <div className="flex justify-between text-ink/70">
              <span>Security deposit</span>
              <span className="font-mono font-medium text-ink">{formatINR(depositTotal)}</span>
            </div>
            <div className="border-t border-ink/8 pt-3 flex justify-between font-semibold text-ink">
              <span>Due now</span>
              <span className="font-mono">{formatINR(monthlyTotal + depositTotal)}</span>
            </div>
          </div>

          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full mt-5 py-3">
            {submitting ? 'Placing order…' : 'Place order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
