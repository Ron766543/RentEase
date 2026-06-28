import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../lib/api.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { formatDate } from '../../lib/format.jsx';

const ROLE_FILTERS = [
  { value: '', label: 'All' },
  { value: 'customer', label: 'Customers' },
  { value: 'vendor', label: 'Vendors' },
  { value: 'admin', label: 'Admins' },
];

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = (role = '') => {
    setLoading(true);
    api.get('/admin/users', { params: role ? { role } : {} }).then(({ data }) => setUsers(data.items)).finally(() => setLoading(false));
  };

  useEffect(() => {
    (() => {
      fetchUsers(roleFilter);
    })();
  }, [roleFilter]);

  const toggleActive = async (user) => {
    try {
      await api.patch(`/admin/users/${user._id}`, { isActive: !user.isActive });
      setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, isActive: !u.isActive } : u)));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const toggleVendorApproval = async (user) => {
    try {
      await api.patch(`/admin/users/${user._id}`, { vendorApproved: !user.vendorApproved });
      setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, vendorApproved: !u.vendorApproved } : u)));
      toast.success(user.vendorApproved ? 'Vendor approval revoked' : 'Vendor approved');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-5">
        {ROLE_FILTERS.map((r) => (
          <button
            key={r.value}
            onClick={() => setRoleFilter(r.value)}
            className={`chip border ${roleFilter === r.value ? 'bg-sage-600 text-paper border-sage-600' : 'border-ink/15 text-ink/70'}`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={26} /></div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/8 text-left text-xs text-mist uppercase tracking-wide">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-ink/8 last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{u.name}</td>
                  <td className="px-4 py-3 text-mist">{u.email}</td>
                  <td className="px-4 py-3 capitalize">{u.role}</td>
                  <td className="px-4 py-3 text-mist">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className={`chip ${u.isActive ? 'bg-sage-100 text-sage-700' : 'bg-red-100 text-red-700'}`}>
                      {u.isActive ? 'Active' : 'Deactivated'}
                    </span>
                    {u.role === 'vendor' && (
                      <span className={`chip ml-1.5 ${u.vendorApproved ? 'bg-sage-100 text-sage-700' : 'bg-amber-100 text-amber-600'}`}>
                        {u.vendorApproved ? 'Approved' : 'Pending review'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    {u.role === 'vendor' && (
                      <button onClick={() => toggleVendorApproval(u)} className="text-xs font-medium text-sage-600 hover:text-sage-700">
                        {u.vendorApproved ? 'Revoke' : 'Approve'}
                      </button>
                    )}
                    {u.role !== 'admin' && (
                      <button onClick={() => toggleActive(u)} className="text-xs font-medium text-mist hover:text-ink">
                        {u.isActive ? 'Deactivate' : 'Reactivate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
