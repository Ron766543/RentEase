import { useEffect, useState } from 'react';
import api from '../../lib/api.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import { formatDate, formatINR } from '../../lib/format.jsx';

const ORDER_STATUSES = ['', 'pending_confirmation', 'confirmed', 'out_for_delivery', 'active', 'return_scheduled', 'returned', 'cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  const fetchOrders = (page = 1, statusFilter = status) => {
    setLoading(true);
    api
      .get('/orders/admin/all', { params: { page, limit: 20, ...(statusFilter ? { status: statusFilter } : {}) } })
      .then(({ data }) => {
        setOrders(data.items);
        setPagination(data.pagination);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    (() => {
      fetchOrders(1, status);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div>
      <div className="flex gap-2 mb-5 overflow-x-auto">
        {ORDER_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`whitespace-nowrap chip border ${status === s ? 'bg-sage-600 text-paper border-sage-600' : 'border-ink/15 text-ink/70'}`}
          >
            {s ? s.replace(/_/g, ' ') : 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={26} /></div>
      ) : (
        <>
          <div className="card divide-y divide-ink/8">
            {orders.map((order) => (
              <div key={order._id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-ink">{order.orderNumber}</p>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-xs text-mist">{order.customer?.name} ({order.customer?.email}) · {formatDate(order.createdAt)}</p>
                </div>
                <p className="font-mono text-sm font-semibold text-ink shrink-0">{formatINR(order.monthlyTotal)}/mo</p>
              </div>
            ))}
            {orders.length === 0 && <p className="p-8 text-center text-sm text-mist">No orders match this filter.</p>}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-5">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => fetchOrders(p)}
                  className={`h-9 w-9 rounded text-sm font-medium ${pagination.page === p ? 'bg-sage-600 text-paper' : 'text-ink/70 hover:bg-ink/5'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminOrders;
