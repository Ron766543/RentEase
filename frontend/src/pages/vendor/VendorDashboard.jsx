import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Package, ClipboardList, Wrench, TrendingUp, Plus, Clock, Check } from 'lucide-react';
import api from '../../lib/api.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { formatINR } from '../../lib/format.jsx';

const VendorDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState(null);

  const fetchAll = useCallback(async () => {
    const [p, o, m] = await Promise.all([
      api.get('/products/vendor/mine'),
      api.get('/orders/vendor/mine'),
      api.get('/maintenance/vendor/mine'),
    ]);
    setProducts(p.data.items);
    setOrders(o.data.items);
    setMaintenance(m.data.items);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await fetchAll();
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchAll]);

  const handleConfirm = async (orderId) => {
    setConfirmingId(orderId);
    try {
      await api.patch(`/orders/${orderId}/status`, { status: 'confirmed' });
      toast.success('Order confirmed');
      await fetchAll();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setConfirmingId(null);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size={26} /></div>;

  const pendingOrders = orders.filter((o) => o.status === 'pending_confirmation');
  const activeRentals = orders.filter((o) => o.status === 'active').length;
  const mrr = orders
    .filter((o) => ['active', 'returned'].includes(o.status))
    .reduce((sum, o) => sum + o.monthlyTotal, 0);
  const openMaintenance = maintenance.filter((m) => ['open', 'acknowledged', 'technician_assigned'].includes(m.status)).length;

  // New orders needing confirmation are shown first, then everything else
  // by recency, so a vendor never has to hunt for what just came in.
  const sortedOrders = [
    ...pendingOrders,
    ...orders.filter((o) => o.status !== 'pending_confirmation'),
  ];

  return (
    <div>
      {pendingOrders.length > 0 && (
        <div className="card border-amber-200 bg-amber-50 p-4 mb-6 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-400 text-ink">
            <Clock size={17} />
          </div>
          <p className="text-sm text-ink">
            <span className="font-semibold">{pendingOrders.length} new order{pendingOrders.length > 1 ? 's' : ''}</span>{' '}
            {pendingOrders.length > 1 ? 'are' : 'is'} waiting for your confirmation.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard icon={Clock} label="Needs confirmation" value={pendingOrders.length} accent={pendingOrders.length > 0} />
        <StatCard icon={Package} label="Listed products" value={products.length} />
        <StatCard icon={ClipboardList} label="Active rentals" value={activeRentals} />
        <StatCard icon={Wrench} label="Open service requests" value={openMaintenance} />
        <StatCard icon={TrendingUp} label="Monthly recurring revenue" value={formatINR(mrr)} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-semibold text-ink">Recent orders</h2>
        <Link to="/vendor/orders" className="text-sm font-medium text-sage-600 hover:text-sage-700">View all →</Link>
      </div>

      {orders.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-sm text-mist mb-4">No orders yet for your listings.</p>
          <Link to="/vendor/products/new" className="btn-primary inline-flex"><Plus size={16} /> Add your first product</Link>
        </div>
      ) : (
        <div className="card divide-y divide-ink/8">
          {sortedOrders.slice(0, 6).map((o) => (
            <div key={o._id} className="flex items-center justify-between gap-3 p-4">
              <Link to={`/vendor/orders/${o._id}`} className="flex-1 min-w-0 hover:opacity-80">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-ink">{o.orderNumber}</p>
                  <StatusBadge status={o.status} />
                </div>
                <p className="text-xs text-mist">{o.items.length} item(s) · {o.deliveryAddress.city}</p>
              </Link>
              <p className="font-mono text-sm text-ink shrink-0">{formatINR(o.monthlyTotal)}/mo</p>
              {o.status === 'pending_confirmation' && (
                <button
                  onClick={() => handleConfirm(o._id)}
                  disabled={confirmingId === o._id}
                  className="btn-secondary text-xs px-3 py-1.5 shrink-0"
                >
                  <Check size={13} /> {confirmingId === o._id ? 'Confirming…' : 'Confirm'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
