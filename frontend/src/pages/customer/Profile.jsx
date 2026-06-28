import { useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2, Plus, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../lib/api.jsx';

const emptyAddress = { label: 'Home', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false };

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, phone: user.phone || '' });
  const [saving, setSaving] = useState(false);
  const [addrForm, setAddrForm] = useState(emptyAddress);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [addrSaving, setAddrSaving] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.patch('/auth/me', form);
      updateUser(data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setAddrSaving(true);
    try {
      const { data } = await api.post('/auth/me/addresses', addrForm);
      updateUser({ addresses: data.addresses });
      setAddrForm(emptyAddress);
      setShowAddrForm(false);
      toast.success('Address added');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAddrSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const { data } = await api.delete(`/auth/me/addresses/${addressId}`);
      updateUser({ addresses: data.addresses });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <h2 className="font-display font-semibold text-ink mb-4">Personal details</h2>
        <form onSubmit={handleSaveProfile} className="space-y-3.5 max-w-sm">
          <div>
            <label className="label">Full name</label>
            <input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input bg-ink/5 cursor-not-allowed" value={user.email} disabled />
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-ink">Saved addresses</h2>
          <button onClick={() => setShowAddrForm((v) => !v)} className="btn-ghost text-sage-600">
            <Plus size={16} /> Add address
          </button>
        </div>

        <div className="space-y-3 mb-4">
          {(user.addresses || []).map((addr) => (
            <div key={addr._id} className="flex items-start gap-3 p-3.5 rounded border border-ink/10">
              <MapPin size={16} className="text-sage-600 mt-0.5 shrink-0" />
              <div className="flex-1 text-sm">
                <p className="font-medium text-ink">{addr.label} {addr.isDefault && <span className="text-xs text-sage-600">(default)</span>}</p>
                <p className="text-mist mt-0.5">{addr.line1}, {addr.line2 ? `${addr.line2}, ` : ''}{addr.city}, {addr.state} {addr.pincode}</p>
              </div>
              <button onClick={() => handleDeleteAddress(addr._id)} className="text-mist hover:text-red-600" aria-label="Delete address">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          {(!user.addresses || user.addresses.length === 0) && (
            <p className="text-sm text-mist">No saved addresses yet.</p>
          )}
        </div>

        {showAddrForm && (
          <form onSubmit={handleAddAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded bg-sage-50">
            <input className="input sm:col-span-2" placeholder="Label (e.g. Home, Work)" value={addrForm.label} onChange={(e) => setAddrForm((f) => ({ ...f, label: e.target.value }))} />
            <input className="input sm:col-span-2" placeholder="Address line 1" value={addrForm.line1} onChange={(e) => setAddrForm((f) => ({ ...f, line1: e.target.value }))} required />
            <input className="input sm:col-span-2" placeholder="Address line 2 (optional)" value={addrForm.line2} onChange={(e) => setAddrForm((f) => ({ ...f, line2: e.target.value }))} />
            <input className="input" placeholder="City" value={addrForm.city} onChange={(e) => setAddrForm((f) => ({ ...f, city: e.target.value }))} required />
            <input className="input" placeholder="State" value={addrForm.state} onChange={(e) => setAddrForm((f) => ({ ...f, state: e.target.value }))} required />
            <input className="input" placeholder="Pincode" value={addrForm.pincode} onChange={(e) => setAddrForm((f) => ({ ...f, pincode: e.target.value }))} required />
            <label className="flex items-center gap-2 text-sm text-ink/70">
              <input type="checkbox" checked={addrForm.isDefault} onChange={(e) => setAddrForm((f) => ({ ...f, isDefault: e.target.checked }))} className="accent-sage-600" />
              Set as default
            </label>
            <div className="sm:col-span-2 flex gap-2">
              <button type="submit" disabled={addrSaving} className="btn-primary flex-1">{addrSaving ? 'Saving…' : 'Save address'}</button>
              <button type="button" onClick={() => setShowAddrForm(false)} className="btn-outline">Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
