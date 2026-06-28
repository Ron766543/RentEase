import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Trash2, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../lib/api.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { SERVICEABLE_CITIES } from '../../context/LocationContext.jsx';

const SUBCATEGORIES = {
  furniture: ['bed', 'sofa', 'table', 'wardrobe', 'dining-table', 'armchair', 'bookshelf', 'bunk-bed'],
  appliances: ['fridge', 'washing-machine', 'tv', 'ac', 'microwave'],
};

const emptyTenure = () => ({ months: 3, monthlyRent: '', discountPercent: 0 });
const emptySpec = () => ({ label: '', value: '' });

const ProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    category: 'furniture',
    subCategory: 'bed',
    brand: '',
    description: '',
    images: [''],
    securityDeposit: '',
    condition: 'like-new',
    totalUnits: 1,
    serviceAreas: [],
    tenureOptions: [emptyTenure()],
    specs: [emptySpec()],
  });
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    api.get('/products/vendor/mine').then(({ data }) => {
      const product = data.items.find((p) => p._id === id);
      if (product) {
        setForm({
          ...product,
          images: product.images?.length ? product.images : [''],
          specs: product.specs?.length ? product.specs : [emptySpec()],
        });
      }
      setLoading(false);
    });
  }, [id, isEdit]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const updateArrayItem = (key, index, patch) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));

  const updateImage = (index, value) =>
    setForm((f) => ({ ...f, images: f.images.map((img, i) => (i === index ? value : img)) }));

  const addArrayItem = (key, factory) => setForm((f) => ({ ...f, [key]: [...f[key], factory()] }));
  const removeArrayItem = (key, index) =>
    setForm((f) => ({ ...f, [key]: f[key].filter((_, i) => i !== index) }));

  const toggleServiceArea = (city) =>
    setForm((f) => ({
      ...f,
      serviceAreas: f.serviceAreas.includes(city)
        ? f.serviceAreas.filter((c) => c !== city)
        : [...f.serviceAreas, city],
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.serviceAreas.length === 0) {
      setError('Select at least one service area.');
      return;
    }
    if (form.tenureOptions.some((t) => !t.monthlyRent)) {
      setError('Every tenure option needs a monthly rent.');
      return;
    }

    setSubmitting(true);
    try {
      const normalizedTenures = form.tenureOptions
        .map((t) => ({ months: Number(t.months), monthlyRent: Number(t.monthlyRent) }))
        .sort((a, b) => a.months - b.months);
      const baseline = normalizedTenures[0]?.monthlyRent || 0;

      const payload = {
        ...form,
        images: form.images.filter(Boolean),
        specs: form.specs.filter((s) => s.label && s.value),
        securityDeposit: Number(form.securityDeposit),
        totalUnits: Number(form.totalUnits),
        tenureOptions: normalizedTenures.map((t, i) => ({
          ...t,
          discountPercent:
            i === 0 || baseline <= 0 ? 0 : Math.round(((baseline - t.monthlyRent) / baseline) * 100),
        })),
      };

      if (isEdit) {
        await api.patch(`/products/${id}`, payload);
        toast.success('Product updated');
      } else {
        await api.post('/products', payload);
        toast.success('Product created');
      }
      navigate('/vendor/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size={26} /></div>;

  return (
    <div>
      <Link to="/vendor/products" className="flex items-center gap-1.5 text-sm text-mist hover:text-ink mb-5">
        <ChevronLeft size={16} /> Back to products
      </Link>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="card p-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="sm:col-span-2">
            <label className="label">Product title</label>
            <input className="input" value={form.title} onChange={(e) => set({ title: e.target.value })} required />
          </div>
          <div>
            <label className="label">Category</label>
            <select
              className="input"
              value={form.category}
              onChange={(e) => set({ category: e.target.value, subCategory: SUBCATEGORIES[e.target.value][0] })}
            >
              <option value="furniture">Furniture</option>
              <option value="appliances">Appliances</option>
            </select>
          </div>
          <div>
            <label className="label">Type</label>
            <select className="input" value={form.subCategory} onChange={(e) => set({ subCategory: e.target.value })}>
              {SUBCATEGORIES[form.category].map((sub) => (
                <option key={sub} value={sub}>{sub.replace('-', ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Brand</label>
            <input className="input" value={form.brand} onChange={(e) => set({ brand: e.target.value })} />
          </div>
          <div>
            <label className="label">Condition</label>
            <select className="input" value={form.condition} onChange={(e) => set({ condition: e.target.value })}>
              <option value="new">New</option>
              <option value="like-new">Like new</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label">Description</label>
            <textarea className="input" rows={3} value={form.description} onChange={(e) => set({ description: e.target.value })} required />
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <label className="label !mb-0">Image URLs</label>
            <button type="button" onClick={() => addArrayItem('images', () => '')} className="btn-ghost text-sage-600 text-xs">
              <Plus size={14} /> Add image
            </button>
          </div>
          {form.images.map((img, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                className="input"
                placeholder="/products/your-image.jpg or https://..."
                value={img}
                onChange={(e) => updateImage(i, e.target.value)}
              />
              {form.images.length > 1 && (
                <button type="button" onClick={() => removeArrayItem('images', i)} className="text-mist hover:text-red-600 px-2">
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))}
          <p className="text-xs text-mist mt-1">Demo listings use placeholder paths — swap in real image URLs for production.</p>
        </div>

        <div className="card p-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="label">Security deposit (₹)</label>
            <input type="number" min="0" className="input" value={form.securityDeposit} onChange={(e) => set({ securityDeposit: e.target.value })} required />
          </div>
          <div>
            <label className="label">Total units in stock</label>
            <input type="number" min="1" className="input" value={form.totalUnits} onChange={(e) => set({ totalUnits: e.target.value })} required />
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <label className="label !mb-0">Tenure & pricing</label>
            <button type="button" onClick={() => addArrayItem('tenureOptions', emptyTenure)} className="btn-ghost text-sage-600 text-xs">
              <Plus size={14} /> Add tenure
            </button>
          </div>
          <p className="text-xs text-mist mb-3">
            The shortest tenure is treated as the full price; the savings badge for longer
            tenures is calculated automatically from what you enter here.
          </p>
          {form.tenureOptions.map((t, i) => {
            const sortedByMonths = [...form.tenureOptions]
              .map((o) => ({ ...o, months: Number(o.months), monthlyRent: Number(o.monthlyRent) || 0 }))
              .sort((a, b) => a.months - b.months);
            const baseline = sortedByMonths[0]?.monthlyRent || 0;
            const thisRent = Number(t.monthlyRent) || 0;
            const isBaseline = sortedByMonths[0]?.months === Number(t.months);
            const computedSaving = !isBaseline && baseline > 0 ? Math.round(((baseline - thisRent) / baseline) * 100) : 0;

            return (
              <div key={i} className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 mb-2 items-end">
                <div>
                  <label className="text-xs text-mist">Months</label>
                  <input type="number" min="1" className="input" value={t.months} onChange={(e) => updateArrayItem('tenureOptions', i, { months: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-mist">Monthly rent (₹)</label>
                  <input type="number" min="0" className="input" value={t.monthlyRent} onChange={(e) => updateArrayItem('tenureOptions', i, { monthlyRent: e.target.value })} />
                </div>
                <div className="px-1 pb-2.5 text-xs text-mist whitespace-nowrap min-w-[88px]">
                  {isBaseline ? (
                    'Full price'
                  ) : computedSaving > 0 ? (
                    <span className="text-sage-600 font-medium">Saves {computedSaving}%</span>
                  ) : (
                    'No saving'
                  )}
                </div>
                {form.tenureOptions.length > 1 && (
                  <button type="button" onClick={() => removeArrayItem('tenureOptions', i)} className="text-mist hover:text-red-600 pb-2.5">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <label className="label !mb-0">Specifications</label>
            <button type="button" onClick={() => addArrayItem('specs', emptySpec)} className="btn-ghost text-sage-600 text-xs">
              <Plus size={14} /> Add spec
            </button>
          </div>
          {form.specs.map((s, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input className="input" placeholder="Label (e.g. Capacity)" value={s.label} onChange={(e) => updateArrayItem('specs', i, { label: e.target.value })} />
              <input className="input" placeholder="Value (e.g. 190 Litres)" value={s.value} onChange={(e) => updateArrayItem('specs', i, { value: e.target.value })} />
              <button type="button" onClick={() => removeArrayItem('specs', i)} className="text-mist hover:text-red-600 px-2">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>

        <div className="card p-5">
          <label className="label">Service areas (cities you can deliver to)</label>
          <div className="flex flex-wrap gap-2">
            {SERVICEABLE_CITIES.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => toggleServiceArea(city)}
                className={`chip border ${
                  form.serviceAreas.includes(city)
                    ? 'bg-sage-600 text-paper border-sage-600'
                    : 'border-ink/15 text-ink/70'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary px-7 py-3">
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
