import { useState } from 'react';
import toast from 'react-hot-toast';
import { X, Wrench } from 'lucide-react';
import api from '../../lib/api.jsx';

const ISSUE_TYPES = [
  { value: 'not_working', label: 'Not working' },
  { value: 'damaged', label: 'Damaged' },
  { value: 'noisy', label: 'Unusually noisy' },
  { value: 'cleaning', label: 'Needs cleaning' },
  { value: 'replacement', label: 'Request replacement' },
  { value: 'other', label: 'Other' },
];

const MaintenanceRequestModal = ({ order, item, onClose, onSubmitted }) => {
  const [form, setForm] = useState({
    issueType: 'not_working',
    description: '',
    preferredDate: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description.trim()) {
      setError('Please describe the issue.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await api.post('/maintenance', {
        orderId: order._id,
        productId: item.product?._id || item.product,
        issueType: form.issueType,
        description: form.description,
        preferredDate: form.preferredDate || undefined,
      });
      toast.success('Maintenance request submitted');
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
      <div className="relative card w-full max-w-md p-6 animate-fade-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-ink flex items-center gap-2">
            <Wrench size={18} className="text-sage-600" /> Request maintenance
          </h2>
          <button onClick={onClose} aria-label="Close"><X size={18} className="text-mist" /></button>
        </div>

        <p className="text-sm text-mist mb-4">{item.title}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">What&apos;s the issue?</label>
            <select className="input" value={form.issueType} onChange={(e) => set({ issueType: e.target.value })}>
              {ISSUE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Describe the problem</label>
            <textarea
              className="input"
              rows={3}
              value={form.description}
              onChange={(e) => set({ description: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="label">Preferred visit date (optional)</label>
            <input
              type="date"
              className="input"
              min={new Date().toISOString().split('T')[0]}
              value={form.preferredDate}
              onChange={(e) => set({ preferredDate: e.target.value })}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full py-2.5">
            {submitting ? 'Submitting…' : 'Submit request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceRequestModal;
