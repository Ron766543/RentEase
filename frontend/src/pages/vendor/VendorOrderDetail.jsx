import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ChevronLeft, MapPin, User } from 'lucide-react';
import api from '../../lib/api.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import { formatDate, formatDateTime, formatINR, STATUS_LABELS } from '../../lib/format.jsx';

const NEXT_STATUS = {
  pending_confirmation: ['confirmed', 'cancelled'],
  confirmed: ['out_for_delivery', 'cancelled'],
  out_for_delivery: ['active', 'cancelled'],
  active: ['return_scheduled', 'returned'],
  return_scheduled: ['returned'],
  returned: [],
  cancelled: [],
};

const VendorOrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [damageForm, setDamageForm] = useState({ damageNotes: '', damageCharge: '' });
  const [showDamageForm, setShowDamageForm] = useState(false);

  const fetchOrder = useCallback(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data.order)).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const updateStatus = async (status) => {
    setUpdating(true);
    try {
      await api.patch(`/orders/${id}/status`, { status });
      toast.success(`Order marked as ${STATUS_LABELS[status]}`);
      fetchOrder();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const submitDamage = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/orders/${id}/damage`, {
        damageNotes: damageForm.damageNotes,
        damageCharge: Number(damageForm.damageCharge) || 0,
      });
      toast.success('Damage reported');
      setShowDamageForm(false);
      fetchOrder();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size={26} /></div>;
  if (!order) return <p className="text-red-600 text-sm">Order not found.</p>;

  const nextOptions = NEXT_STATUS[order.status] || [];

  return (
    <div>
      <Link to="/vendor/orders" className="flex items-center gap-1.5 text-sm text-mist hover:text-ink mb-5">
        <ChevronLeft size={16} /> All orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink">{order.orderNumber}</h1>
          <p className="text-sm text-mist mt-1">Placed {formatDate(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-5">
          <div className="card p-5">
            <h2 className="font-display font-semibold text-ink mb-4">Items</h2>
            {order.items.map((item) => (
              <div key={item._id} className="flex justify-between py-2.5 border-b border-ink/8 last:border-0 text-sm">
                <span className="text-ink">{item.title} × {item.quantity}</span>
                <span className="font-mono text-ink">{formatINR(item.monthlyRent * item.quantity)}/mo</span>
              </div>
            ))}
          </div>

          <div className="card p-5">
            <h2 className="font-display font-semibold text-ink mb-4 flex items-center gap-2">
              <MapPin size={16} className="text-sage-600" /> Delivery
            </h2>
            <p className="text-sm text-ink/80 leading-relaxed">
              {order.deliveryAddress.line1}, {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.pincode}
            </p>
            <p className="text-sm text-mist mt-2">{formatDate(order.deliveryDate)} · {order.deliverySlot}</p>
          </div>

          <div className="card p-5">
            <h2 className="font-display font-semibold text-ink mb-4">Timeline</h2>
            <ul className="space-y-3">
              {[...order.statusHistory].reverse().map((entry, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-sage-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-ink font-medium">{entry.note}</p>
                    <p className="text-xs text-mist">{formatDateTime(entry.changedAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-5 h-fit">
          <div className="card p-5">
            <h2 className="font-display font-semibold text-ink mb-3 flex items-center gap-2">
              <User size={16} className="text-sage-600" /> Customer
            </h2>
            <p className="text-sm text-ink">{order.customer?.name}</p>
            <p className="text-sm text-mist">{order.customer?.email}</p>
          </div>

          {nextOptions.length > 0 && (
            <div className="card p-5 space-y-2">
              <h2 className="font-display font-semibold text-ink mb-2">Update status</h2>
              {nextOptions.map((status) => (
                <button
                  key={status}
                  disabled={updating}
                  onClick={() => updateStatus(status)}
                  className={status === 'cancelled' ? 'btn-outline w-full text-red-600 hover:bg-red-50' : 'btn-secondary w-full'}
                >
                  Mark as {STATUS_LABELS[status]}
                </button>
              ))}
            </div>
          )}

          {['return_scheduled', 'returned'].includes(order.status) && (
            <div className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-display font-semibold text-ink">Damage report</h2>
                {!order.damageReported && (
                  <button onClick={() => setShowDamageForm((v) => !v)} className="text-xs font-medium text-sage-600">
                    {showDamageForm ? 'Cancel' : 'Report damage'}
                  </button>
                )}
              </div>
              {order.damageReported ? (
                <div className="text-sm">
                  <p className="text-ink/80">{order.damageNotes}</p>
                  <p className="font-mono text-red-600 mt-1">Charge: {formatINR(order.damageCharge)}</p>
                </div>
              ) : showDamageForm ? (
                <form onSubmit={submitDamage} className="space-y-3">
                  <textarea
                    className="input"
                    rows={2}
                    placeholder="Describe the damage"
                    value={damageForm.damageNotes}
                    onChange={(e) => setDamageForm((f) => ({ ...f, damageNotes: e.target.value }))}
                    required
                  />
                  <input
                    type="number"
                    className="input"
                    placeholder="Charge amount (₹)"
                    value={damageForm.damageCharge}
                    onChange={(e) => setDamageForm((f) => ({ ...f, damageCharge: e.target.value }))}
                  />
                  <button type="submit" className="btn-primary w-full">Submit report</button>
                </form>
              ) : (
                <p className="text-sm text-mist">No damage reported.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorOrderDetail;
