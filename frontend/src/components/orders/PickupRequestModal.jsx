import { useState } from 'react';
import toast from 'react-hot-toast';
import { X, Truck } from 'lucide-react';
import api from '../../lib/api.jsx';

const todayPlus = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

const PickupRequestModal = ({ order, onClose, onSubmitted }) => {
  const [form, setForm] = useState({ pickupDate: todayPlus(2), pickupSlot: 'morning' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post(`/orders/${order._id}/pickup`, form);
      toast.success('Pickup scheduled');
      onSubmitted?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative card w-full max-w-sm p-6 animate-fade-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-ink flex items-center gap-2">
            <Truck size={18} className="text-sage-600" /> Schedule return
          </h2>
          <button onClick={onClose} aria-label="Close"><X size={18} className="text-mist" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Pickup date</label>
            <input
              type="date"
              className="input"
              min={todayPlus(1)}
              value={form.pickupDate}
              onChange={(e) => setForm((f) => ({ ...f, pickupDate: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="label">Time slot</label>
            <select
              className="input"
              value={form.pickupSlot}
              onChange={(e) => setForm((f) => ({ ...f, pickupSlot: e.target.value }))}
            >
              <option value="morning">Morning (9am – 12pm)</option>
              <option value="afternoon">Afternoon (12pm – 4pm)</option>
              <option value="evening">Evening (4pm – 8pm)</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full py-2.5">
            {submitting ? 'Scheduling…' : 'Confirm pickup'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PickupRequestModal;
