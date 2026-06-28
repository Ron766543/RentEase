import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PackageOpen } from 'lucide-react';
import api from '../../lib/api.jsx';
import OrderCard from '../../components/orders/OrderCard.jsx';
import Spinner from '../../components/ui/Spinner.jsx';

const MyRentals = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/orders/mine')
      .then(({ data }) => setOrders(data.items))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner size={26} /></div>;
  if (error) return <p className="text-red-600 text-sm">{error}</p>;

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <PackageOpen className="h-10 w-10 text-sage-300 mx-auto mb-3" />
        <p className="font-display text-lg text-ink mb-1">No rentals yet</p>
        <p className="text-sm text-mist mb-5">Browse the catalog to start your first rental.</p>
        <Link to="/catalog" className="btn-primary inline-flex">Browse catalog</Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <OrderCard key={order._id} order={order} />
      ))}
    </div>
  );
};

export default MyRentals;
