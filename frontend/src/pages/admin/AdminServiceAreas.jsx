import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, MapPin } from 'lucide-react';
import api from '../../lib/api.jsx';
import Spinner from '../../components/ui/Spinner.jsx';

const AdminServiceAreas = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ city: '', state: '', pincodesServed: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchAreas = () => {
    api.get('/admin/service-areas').then(({ data }) => setAreas(data.items)).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const toggleActive = async (area) => {
    try {
      await api.patch(`/admin/service-areas/${area._id}`, { isActive: !area.isActive });
      setAreas((prev) => prev.map((a) => (a._id === area._id ? { ...a, isActive: !a.isActive } : a)));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/admin/service-areas', {
        city: form.city,
        state: form.state,
        pincodesServed: form.pincodesServed.split(',').map((p) => p.trim()).filter(Boolean),
      });
      toast.success('Service area added');
      setForm({ city: '', state: '', pincodesServed: '' });
      setShowForm(false);
      fetchAreas();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size={26} /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-mist">{areas.length} city/cities serviceable</p>
        <button onClick={() => setShowForm((v) => !v)} className="btn-primary">
          <Plus size={16} /> Add city
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card p-5 grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <input className="input" placeholder="City" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} required />
          <input className="input" placeholder="State" value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} required />
          <input className="input" placeholder="Pincodes (comma separated)" value={form.pincodesServed} onChange={(e) => setForm((f) => ({ ...f, pincodesServed: e.target.value }))} />
          <button type="submit" disabled={submitting} className="btn-secondary sm:col-span-3">
            {submitting ? 'Adding…' : 'Add service area'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {areas.map((area) => (
          <div key={area._id} className="card p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-sage-600" />
                <p className="font-display font-semibold text-ink">{area.city}</p>
              </div>
              <span className={`chip ${area.isActive ? 'bg-sage-100 text-sage-700' : 'bg-ink/10 text-mist'}`}>
                {area.isActive ? 'Active' : 'Paused'}
              </span>
            </div>
            <p className="text-sm text-mist mb-3">{area.state}</p>
            <p className="text-xs text-mist mb-3">{area.pincodesServed?.length || 0} pincode(s) served</p>
            <button onClick={() => toggleActive(area)} className="btn-outline w-full text-xs py-1.5">
              {area.isActive ? 'Pause service' : 'Resume service'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminServiceAreas;
