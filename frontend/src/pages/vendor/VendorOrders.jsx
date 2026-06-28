import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Check } from 'lucide-react';
import api from '../../lib/api.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import { formatDate, formatINR } from '../../lib/format.jsx';

const STATUS_ORDER = [
  'pending_confirmation',
  'confirmed',
  'out_for_delivery',
  'active',
  'return_scheduled',
  'returned',
  'cancelled',
];

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [confirmingId, setConfirmingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    const { data } = await api.get('/orders/vendor/mine');
    setOrders(data.items);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await fetchOrders();
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchOrders]);

  const handleConfirm = async (orderId) => {
    setConfirmingId(orderId);
    try {
      await api.patch(`/orders/${orderId}/status`, { status: 'confirmed' });
      toast.success('Order confirmed');
      await fetchOrders();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setConfirmingId(null);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size={26} /></div>;

  const filtered = statusFilter ? orders.filter((o) => o.status === statusFilter) : orders;
  // With no filter applied, orders needing confirmation surface first.
  const sorted = statusFilter
    ? filtered
    : [...filtered].sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status));
  const pendingCount = orders.filter((o) => o.status === 'pending_confirmation').length;

  return (
    <div>
      {pendingCount > 0 && (
        <div className="card border-amber-200 bg-amber-50 p-3.5 mb-5 text-sm text-ink">
          <span className="font-semibold">{pendingCount} order{pendingCount > 1 ? 's' : ''}</span>{' '}
          {pendingCount > 1 ? 'need' : 'needs'} your confirmation.
        </div>
      )}

      <div className="flex items-center gap-2 mb-5 overflow-x-auto">
        {['', ...STATUS_ORDER].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`whitespace-nowrap chip border ${
              statusFilter === s ? 'bg-sage-600 text-paper border-sage-600' : 'border-ink/15 text-ink/70'
            }`}
          >
            {s ? s.replace(/_/g, ' ') : 'All'}
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <div className="card p-10 text-center text-sm text-mist">No orders match this filter.</div>
      ) : (
        <div className="card divide-y divide-ink/8">
          {sorted.map((order) => (
            <div key={order._id} className="flex items-center justify-between gap-4 p-4">
              <Link to={`/vendor/orders/${order._id}`} className="min-w-0 flex-1 hover:opacity-80">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-ink">{order.orderNumber}</p>
                  <StatusBadge status={order.status} />
                </div>
                <p className="text-xs text-mist">{order.customer?.name} · {order.deliveryAddress.city} · {formatDate(order.deliveryDate)}</p>
              </Link>
              <p className="font-mono text-sm font-semibold text-ink shrink-0">{formatINR(order.monthlyTotal)}/mo</p>
              {order.status === 'pending_confirmation' && (
                <button
                  onClick={() => handleConfirm(order._id)}
                  disabled={confirmingId === order._id}
                  className="btn-secondary text-xs px-3 py-1.5 shrink-0"
                >
                  <Check size={13} /> {confirmingId === order._id ? 'Confirming…' : 'Confirm'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorOrders;
