import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatINR } from '../../lib/format.jsx';
import CartItemRow from '../../components/cart/CartItemRow.jsx';

const Cart = () => {
  const { items, monthlyTotal: getMonthlyTotal, depositTotal: getDepositTotal } = useCart();
  const monthlyTotal = getMonthlyTotal();
  const depositTotal = getDepositTotal();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <ShoppingBag className="h-12 w-12 text-sage-300 mx-auto mb-4" />
        <h1 className="font-display text-xl font-semibold text-ink">Your cart is empty</h1>
        <p className="text-sm text-mist mt-1.5 mb-6">Browse the catalog to find something to rent.</p>
        <Link to="/catalog" className="btn-primary inline-flex">Browse catalog</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="font-display text-2xl font-semibold text-ink mb-6">Your cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        <div className="card p-5">
          {items.map((item) => (
            <CartItemRow key={`${item.productId}-${item.tenureMonths}`} item={item} />
          ))}
        </div>

        <div className="card p-5 h-fit">
          <h2 className="font-display font-semibold text-ink mb-4">Order summary</h2>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-ink/70">
              <span>Monthly rent total</span>
              <span className="font-mono font-medium text-ink">{formatINR(monthlyTotal)}</span>
            </div>
            <div className="flex justify-between text-ink/70">
              <span>Security deposit (refundable)</span>
              <span className="font-mono font-medium text-ink">{formatINR(depositTotal)}</span>
            </div>
            <div className="border-t border-ink/8 pt-3 flex justify-between font-semibold text-ink">
              <span>Due at delivery</span>
              <span className="font-mono">{formatINR(monthlyTotal + depositTotal)}</span>
            </div>
          </div>
          <button onClick={handleCheckout} className="btn-primary w-full mt-5 py-3">
            Proceed to checkout
            <ArrowRight size={16} />
          </button>
          <p className="text-xs text-mist text-center mt-3">
            Subsequent months are billed automatically each cycle.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
