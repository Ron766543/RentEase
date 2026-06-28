import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Truck, Wrench, CalendarPlus, ChevronLeft } from 'lucide-react';
import api from '../../lib/api.jsx';
import { formatDate, formatDateTime, formatINR } from '../../lib/format.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import OrderTracker from '../../components/orders/OrderTracker.jsx';
import PickupRequestModal from '../../components/orders/PickupRequestModal.jsx';
import ExtensionRequestModal from '../../components/orders/ExtensionRequestModal.jsx';
import MaintenanceRequestModal from '../../components/orders/MaintenanceRequestModal.jsx';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeModal, setActiveModal] = useState(null); // 'pickup' | 'extend' | { type: 'maintenance', item }

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data.order);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let active = true;
    (async () => {
      if (active) await fetchOrder();
    })();
    return () => {
      active = false;
    };
  }, [fetchOrder]);

  if (loading) return <div className="flex justify-center py-20"><Spinner size={26} /></div>;
  if (error || !order) return <p className="text-red-600 text-sm">{error || 'Order not found.'}</p>;

  // A return can only be scheduled once the order is actually delivered.
  const canSchedulePickup = order.status === 'active';
  const canExtend = order.status === 'active';
  const canRequestMaintenance = order.status === 'active';

  return (
    <div>
      <Link to="/account/orders" className="flex items-center gap-1.5 text-sm text-mist hover:text-ink mb-5">
        <ChevronLeft size={16} /> All rentals
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink">{order.orderNumber}</h1>
          <p className="text-sm text-mist mt-1">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-5">
          <OrderTracker status={order.status} />

          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-ink">Items</h2>
              {!canRequestMaintenance && order.status !== 'returned' && order.status !== 'cancelled' && (
                <p className="text-xs text-mist">Support available once delivered</p>
              )}
            </div>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item._id} className="flex items-center gap-4 pb-4 border-b border-ink/8 last:border-0 last:pb-0">
                  <div className="h-16 w-16 shrink-0 rounded bg-sage-50 overflow-hidden">
                    {item.image && (
                      <img src={item.image} alt={item.title} className="h-full w-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink">{item.title}</p>
                    <p className="text-xs text-mist mt-0.5">
                      {item.tenureMonths}-month tenure · Qty {item.quantity} · Deposit {formatINR(item.securityDeposit)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono text-sm font-semibold text-ink">{formatINR(item.monthlyRent * item.quantity)}/mo</p>
                  </div>
                  {canRequestMaintenance && (
                    <button
                      onClick={() => setActiveModal({ type: 'maintenance', item })}
                      className="btn-outline text-xs px-3 py-1.5 shrink-0"
                    >
                      <Wrench size={13} /> Support
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="font-display font-semibold text-ink mb-4 flex items-center gap-2">
              <MapPin size={16} className="text-sage-600" /> Delivery address
            </h2>
            <p className="text-sm text-ink/80 leading-relaxed">
              {order.deliveryAddress.line1}
              {order.deliveryAddress.line2 ? `, ${order.deliveryAddress.line2}` : ''}
              <br />
              {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.pincode}
            </p>
          </div>

          <div className="card p-5">
            <h2 className="font-display font-semibold text-ink mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-sage-600" /> Activity log
            </h2>
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
            <h2 className="font-display font-semibold text-ink mb-4">Summary</h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-ink/70">
                <span>Monthly rent</span>
                <span className="font-mono font-medium text-ink">{formatINR(order.monthlyTotal)}</span>
              </div>
              <div className="flex justify-between text-ink/70">
                <span>Security deposit</span>
                <span className="font-mono font-medium text-ink">{formatINR(order.depositTotal)}</span>
              </div>
              {order.damageCharge > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Damage charge</span>
                  <span className="font-mono font-medium">{formatINR(order.damageCharge)}</span>
                </div>
              )}
              <div className="border-t border-ink/8 pt-3 flex justify-between font-semibold text-ink">
                <span>First payment</span>
                <span className="font-mono">{formatINR(order.grandTotalFirstPayment)}</span>
              </div>
            </div>

            {order.rentalStartDate && (
              <div className="mt-4 pt-4 border-t border-ink/8 text-sm space-y-1.5">
                <p className="flex justify-between"><span className="text-mist">Started</span><span className="text-ink">{formatDate(order.rentalStartDate)}</span></p>
                {order.rentalEndDate && (
                  <p className="flex justify-between"><span className="text-mist">Tenure ends</span><span className="text-ink">{formatDate(order.rentalEndDate)}</span></p>
                )}
              </div>
            )}
          </div>

          <div className="card p-5 space-y-2.5">
            <h2 className="font-display font-semibold text-ink mb-1">Manage rental</h2>
            {canExtend && (
              <button onClick={() => setActiveModal('extend')} className="btn-outline w-full">
                <CalendarPlus size={16} /> Extend tenure
              </button>
            )}
            {canSchedulePickup && (
              <button onClick={() => setActiveModal('pickup')} className="btn-outline w-full">
                <Truck size={16} /> Schedule return
              </button>
            )}
            {!canExtend && !canSchedulePickup && (
              <p className="text-sm text-mist leading-relaxed">
                {order.status === 'pending_confirmation' &&
                  'Extension and return options will appear here once the vendor confirms your order.'}
                {order.status === 'confirmed' &&
                  'Extension and return options will appear here once your delivery is out for dispatch and received.'}
                {order.status === 'out_for_delivery' &&
                  'Extension and return options will appear here once you receive your delivery.'}
                {order.status === 'return_scheduled' &&
                  'Your pickup is already scheduled — track its progress above.'}
                {(order.status === 'returned' || order.status === 'cancelled') &&
                  'This order is closed, so there is nothing left to manage here.'}
              </p>
            )}
          </div>
        </div>
      </div>

      {activeModal === 'pickup' && (
        <PickupRequestModal order={order} onClose={() => setActiveModal(null)} onSubmitted={fetchOrder} />
      )}
      {activeModal === 'extend' && (
        <ExtensionRequestModal order={order} onClose={() => setActiveModal(null)} onSubmitted={fetchOrder} />
      )}
      {activeModal?.type === 'maintenance' && (
        <MaintenanceRequestModal
          order={order}
          item={activeModal.item}
          onClose={() => setActiveModal(null)}
          onSubmitted={fetchOrder}
        />
      )}
    </div>
  );
};

export default OrderDetail;
