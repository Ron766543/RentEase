import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import toast from 'react-hot-toast';
import { ShieldCheck, Truck, Wrench, ChevronLeft } from 'lucide-react';
import api from '../../lib/api.jsx';
import { formatINR } from '../../lib/format.jsx';
import { CategoryIcon } from '../../icons/CategoryIcons.jsx';
import TenureTimeline from '../../components/catalog/TenureTimeline.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMonths, setSelectedMonths] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let active = true;

    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${slug}`);
        if (!active) return;
        setProduct(data.product);
        const sorted = [...data.product.tenureOptions].sort((a, b) => a.months - b.months);
        setSelectedMonths(sorted[0]?.months);
        setError('');
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProduct();
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return <div className="flex justify-center py-32"><Spinner size={28} /></div>;
  }

  if (error || !product) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-red-600">{error || 'Product not found.'}</p>
        <Link to="/catalog" className="btn-outline mt-4 inline-flex">Back to catalog</Link>
      </div>
    );
  }

  const selectedTenure = product.tenureOptions.find((t) => t.months === selectedMonths);
  const isOut = product.availableUnits === 0;

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please log in to add items to your cart.');
      navigate('/login', { state: { from: { pathname: `/product/${slug}` } } });
      return;
    }
    if (!selectedTenure) return;

    addItem({
      productId: product._id,
      slug: product.slug,
      title: product.title,
      image: product.images?.[0] || '',
      securityDeposit: product.securityDeposit,
      tenureMonths: selectedTenure.months,
      monthlyRent: selectedTenure.monthlyRent,
      quantity,
      availableUnits: product.availableUnits,
    });
    toast.success('Added to cart');
  };

  return (
    <div className="container-page py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-mist hover:text-ink mb-5">
        <ChevronLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          {product.images?.length > 0 ? (
            <div className="relative rounded-lg overflow-hidden bg-sage-50 aspect-[4/3]">
              <Swiper
                modules={[Navigation]}
                navigation
                spaceBetween={12}
                className="absolute inset-0"
              >
                {product.images.map((img, i) => (
                  <SwiperSlide key={i}>
                    <img
                      src={img}
                      alt={`${product.title} ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.opacity = 0; }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            <div className="aspect-[4/3] rounded-lg bg-sage-50 flex items-center justify-center">
              <CategoryIcon subCategory={product.subCategory} className="h-16 w-16 text-sage-300" />
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-1.5 text-sm text-mist mb-2">
            <CategoryIcon subCategory={product.subCategory} className="h-4 w-4" />
            {product.brand || 'RentEase'}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink leading-tight">
            {product.title}
          </h1>
          <p className="text-sm text-mist mt-2 capitalize">{product.condition.replace('-', ' ')} condition</p>

          <p className="text-sm text-ink/70 leading-relaxed mt-5">{product.description}</p>

          {product.specs?.length > 0 && (
            <dl className="grid grid-cols-2 gap-3 mt-5 border-t border-ink/8 pt-5">
              {product.specs.map((spec) => (
                <div key={spec.label}>
                  <dt className="text-xs text-mist">{spec.label}</dt>
                  <dd className="text-sm font-medium text-ink">{spec.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="border-t border-ink/8 pt-6 mt-6">
            <p className="font-display text-sm font-semibold text-ink mb-3">Choose your tenure</p>
            <TenureTimeline
              options={product.tenureOptions}
              selectedMonths={selectedMonths}
              onSelect={setSelectedMonths}
            />
          </div>

          <div className="flex items-center justify-between mt-6 p-4 rounded-lg bg-sage-50">
            <div>
              <p className="text-xs text-mist">Refundable security deposit</p>
              <p className="font-mono text-base font-semibold text-ink">{formatINR(product.securityDeposit)}</p>
            </div>
            <ShieldCheck className="h-6 w-6 text-sage-500" />
          </div>

          <div className="flex items-center gap-3 mt-6">
            <div className="flex items-center border border-ink/15 rounded">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="h-11 w-11 text-ink/70 hover:bg-ink/5"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.availableUnits, q + 1))}
                className="h-11 w-11 text-ink/70 hover:bg-ink/5"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isOut}
              className="btn-primary flex-1 py-3 text-base"
            >
              {isOut ? 'Out of stock' : 'Add to cart'}
            </button>
          </div>
          {!isOut && (
            <p className="text-xs text-mist mt-2">{product.availableUnits} unit(s) available</p>
          )}

          <div className="grid grid-cols-2 gap-4 mt-7 pt-6 border-t border-ink/8">
            <div className="flex items-start gap-2.5">
              <Truck className="h-5 w-5 text-sage-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-ink">Doorstep delivery</p>
                <p className="text-xs text-mist">Schedule a date that suits you</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Wrench className="h-5 w-5 text-sage-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-ink">Free maintenance</p>
                <p className="text-xs text-mist">Support included throughout your rental</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
