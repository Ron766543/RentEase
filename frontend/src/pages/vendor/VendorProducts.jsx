import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, EyeOff, Eye } from 'lucide-react';
import api from '../../lib/api.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { formatINR, CATEGORY_LABELS, SUBCATEGORY_LABELS } from '../../lib/format.jsx';
import { CategoryIcon } from '../../icons/CategoryIcons.jsx';

const VendorProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    api.get('/products/vendor/mine').then(({ data }) => setProducts(data.items)).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const togglePublish = async (product) => {
    try {
      await api.patch(`/products/${product._id}`, { isPublished: !product.isPublished });
      setProducts((prev) =>
        prev.map((p) => (p._id === product._id ? { ...p, isPublished: !p.isPublished } : p))
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Remove "${product.title}" from your catalog?`)) return;
    try {
      await api.delete(`/products/${product._id}`);
      setProducts((prev) => prev.filter((p) => p._id !== product._id));
      toast.success('Product removed');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size={26} /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-mist">{products.length} product(s) listed</p>
        <Link to="/vendor/products/new" className="btn-primary">
          <Plus size={16} /> Add product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-sm text-mist mb-4">You haven&apos;t listed any products yet.</p>
          <Link to="/vendor/products/new" className="btn-primary inline-flex"><Plus size={16} /> Add your first product</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => {
            const cheapest = [...product.tenureOptions].sort((a, b) => a.monthlyRent - b.monthlyRent)[0];
            return (
              <div key={product._id} className="card overflow-hidden">
                <div className="aspect-[4/3] bg-sage-50 flex items-center justify-center relative">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                  ) : (
                    <CategoryIcon subCategory={product.subCategory} className="h-10 w-10 text-sage-300" />
                  )}
                  {!product.isPublished && (
                    <span className="absolute top-2 left-2 chip bg-ink text-paper">Unpublished</span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-mist mb-1">{CATEGORY_LABELS[product.category]} · {SUBCATEGORY_LABELS[product.subCategory] || product.subCategory}</p>
                  <h3 className="text-sm font-medium text-ink line-clamp-1 mb-2">{product.title}</h3>
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-mono text-sm font-semibold text-ink">{formatINR(cheapest?.monthlyRent)}/mo</p>
                    <p className="text-xs text-mist">{product.availableUnits}/{product.totalUnits} available</p>
                  </div>
                  <div className="flex gap-1.5">
                    <Link to={`/vendor/products/${product._id}/edit`} className="btn-outline flex-1 text-xs px-2 py-1.5">
                      <Pencil size={13} /> Edit
                    </Link>
                    <button onClick={() => togglePublish(product)} className="btn-outline text-xs px-2 py-1.5" title={product.isPublished ? 'Unpublish' : 'Publish'}>
                      {product.isPublished ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                    <button onClick={() => handleDelete(product)} className="btn-outline text-xs px-2 py-1.5 text-red-600 hover:bg-red-50" title="Delete">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VendorProducts;
