import { useState } from 'react';
import toast from 'react-hot-toast';
import { X, CalendarPlus } from 'lucide-react';
import api from '../../lib/api.jsx';

const ExtensionRequestModal = ({ order, onClose, onSubmitted }) => {
  const [months, setMonths] = useState(3);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post(`/orders/${order._id}/extend`, { extraMonths: Number(months) });
      toast.success('Rental extended');
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
            <CalendarPlus size={18} className="text-sage-600" /> Extend rental
          </h2>
          <button onClick={onClose} aria-label="Close"><X size={18} className="text-mist" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Extend by how many months?</label>
            <div className="flex gap-2">
              {[1, 3, 6].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMonths(m)}
                  className={`flex-1 rounded border py-2.5 text-sm font-medium ${
                    months === m ? 'border-sage-600 bg-sage-600 text-paper' : 'border-ink/15 text-ink/70'
                  }`}
                >
                  {m} mo
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full py-2.5">
            {submitting ? 'Extending…' : 'Confirm extension'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExtensionRequestModal;
