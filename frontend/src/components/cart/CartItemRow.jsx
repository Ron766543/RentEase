import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { formatINR } from '../../lib/format.jsx';
import { useCart } from '../../context/CartContext.jsx';

const CartItemRow = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-4 py-5 border-b border-ink/8 last:border-0">
      <Link to={`/product/${item.slug}`} className="h-20 w-20 shrink-0 rounded bg-sage-50 flex items-center justify-center overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.title} className="h-full w-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
        ) : null}
      </Link>

      <div className="flex-1 min-w-0">
        <Link to={`/product/${item.slug}`} className="text-sm font-medium text-ink hover:text-sage-600 line-clamp-1">
          {item.title}
        </Link>
        <p className="text-xs text-mist mt-1">{item.tenureMonths}-month tenure · Deposit {formatINR(item.securityDeposit)}</p>

        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center border border-ink/15 rounded">
            <button
              onClick={() => updateQuantity(item.productId, item.tenureMonths, item.quantity - 1)}
              className="h-8 w-8 text-ink/70 hover:bg-ink/5 text-sm"
            >
              −
            </button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.productId, item.tenureMonths, item.quantity + 1)}
              className="h-8 w-8 text-ink/70 hover:bg-ink/5 text-sm"
            >
              +
            </button>
          </div>
          <button
            onClick={() => removeItem(item.productId, item.tenureMonths)}
            className="text-mist hover:text-red-600"
            aria-label="Remove item"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <p className="font-mono text-sm font-semibold text-ink shrink-0">
        {formatINR(item.monthlyRent * item.quantity)}
        <span className="text-xs font-body font-normal text-mist">/mo</span>
      </p>
    </div>
  );
};

export default CartItemRow;
