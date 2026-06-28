import { useEffect, useState } from 'react';
import api from '../../lib/api.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { formatDate } from '../../lib/format.jsx';

const STATUS_FILTERS = ['', 'open', 'acknowledged', 'technician_assigned', 'resolved', 'closed'];

const AdminMaintenance = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      if (!active) return;
      setLoading(true);
      try {
        const { data } = await api.get('/maintenance/admin/all', { params: status ? { status } : {} });
        if (active) setRequests(data.items);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [status]);

  return (
    <div>
      <div className="flex gap-2 mb-5 overflow-x-auto">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`whitespace-nowrap chip border ${status === s ? 'bg-sage-600 text-paper border-sage-600' : 'border-ink/15 text-ink/70'}`}
          >
            {s ? s.replace(/_/g, ' ') : 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={26} /></div>
      ) : requests.length === 0 ? (
        <div className="card p-10 text-center text-sm text-mist">No requests match this filter.</div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <div key={req._id} className="card p-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-ink">{req.product?.title}</p>
                <p className="text-xs text-mist mt-0.5">
                  {req.customer?.name} → {req.vendor?.businessName || req.vendor?.name} · Filed {formatDate(req.createdAt)}
                </p>
                <p className="text-sm text-ink/80 mt-2">{req.description}</p>
              </div>
              <span className="chip bg-sage-100 text-sage-700 capitalize shrink-0">{req.status.replace(/_/g, ' ')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMaintenance;
