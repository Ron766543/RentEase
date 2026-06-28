import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { formatDate, formatINR } from '../../lib/format.jsx';
import StatusBadge from '../ui/StatusBadge.jsx';

const OrderCard = ({ order }) => (
  <Link
    to={`/account/orders/${order._id}`}
    className="card p-5 flex items-center gap-4 hover:shadow-lift transition-shadow"
  >
    <div className="flex -space-x-3 shrink-0">
      {order.items.slice(0, 3).map((item, i) => (
        <div
          key={item._id || i}
          className="h-12 w-12 rounded-full border-2 border-paper bg-sage-50 overflow-hidden"
          style={{ zIndex: 3 - i }}
        >
          {item.image && (
            <img src={item.image} alt={item.title} className="h-full w-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
          )}
        </div>
      ))}
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <p className="text-sm font-semibold text-ink">{order.orderNumber}</p>
        <StatusBadge status={order.status} />
      </div>
      <p className="text-sm text-mist line-clamp-1">
        {order.items.map((i) => i.title).join(', ')}
      </p>
      <p className="text-xs text-mist mt-1">Delivery on {formatDate(order.deliveryDate)}</p>
    </div>

    <div className="text-right shrink-0">
      <p className="font-mono text-sm font-semibold text-ink">{formatINR(order.monthlyTotal)}/mo</p>
    </div>

    <ChevronRight size={18} className="text-mist shrink-0" />
  </Link>
);

export default OrderCard;
