import { useEffect, useState } from 'react';
import { Users, Package, ClipboardList, Wrench, TrendingUp, PiggyBank } from 'lucide-react';
import api from '../../lib/api.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { formatINR, STATUS_LABELS } from '../../lib/format.jsx';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard-stats').then(({ data }) => setStats(data.stats)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner size={26} /></div>;
  if (!stats) return null;

  const maxStatusCount = Math.max(...stats.statusBreakdown.map((s) => s.count), 1);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} label="Monthly recurring revenue" value={formatINR(stats.monthlyRecurringRevenue)} accent />
        <StatCard icon={ClipboardList} label="Active rentals" value={stats.activeRentals} />
        <StatCard icon={Users} label="Customers" value={stats.totalCustomers} />
        <StatCard icon={Users} label="Vendors" value={stats.totalVendors} />
        <StatCard icon={Package} label="Listed products" value={stats.totalProducts} />
        <StatCard icon={Wrench} label="Pending maintenance" value={stats.pendingMaintenance} />
        <StatCard icon={PiggyBank} label="Deposits held" value={formatINR(stats.depositsHeld)} />
        <StatCard icon={TrendingUp} label="Product utilization" value={`${stats.productUtilizationRate}%`} />
      </div>

      <div className="card p-5">
        <h2 className="font-display font-semibold text-ink mb-4">Orders by status</h2>
        <div className="space-y-2.5">
          {stats.statusBreakdown.map((s) => (
            <div key={s._id} className="flex items-center gap-3">
              <p className="text-xs text-mist w-36 shrink-0">{STATUS_LABELS[s._id] || s._id}</p>
              <div className="flex-1 h-2.5 rounded-full bg-ink/8 overflow-hidden">
                <div
                  className="h-full bg-sage-500 rounded-full"
                  style={{ width: `${(s.count / maxStatusCount) * 100}%` }}
                />
              </div>
              <p className="text-xs font-mono text-ink w-8 text-right shrink-0">{s.count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
