import { useEffect, useState } from 'react';
import { Wrench } from 'lucide-react';
import api from '../../lib/api.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { formatDate } from '../../lib/format.jsx';

const ISSUE_LABELS = {
  not_working: 'Not working',
  damaged: 'Damaged',
  noisy: 'Unusually noisy',
  cleaning: 'Needs cleaning',
  replacement: 'Replacement requested',
  other: 'Other',
};

const STATUS_LABELS = {
  open: 'Open',
  acknowledged: 'Acknowledged',
  technician_assigned: 'Technician assigned',
  resolved: 'Resolved',
  closed: 'Closed',
};

const STATUS_COLORS = {
  open: 'bg-amber-100 text-amber-600',
  acknowledged: 'bg-sage-100 text-sage-700',
  technician_assigned: 'bg-sage-100 text-sage-700',
  resolved: 'bg-sage-600 text-paper',
  closed: 'bg-ink/10 text-mist',
};

const MyMaintenanceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/maintenance/mine').then(({ data }) => setRequests(data.items)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner size={26} /></div>;

  if (requests.length === 0) {
    return (
      <div className="text-center py-16">
        <Wrench className="h-10 w-10 text-sage-300 mx-auto mb-3" />
        <p className="font-display text-lg text-ink mb-1">No maintenance requests</p>
        <p className="text-sm text-mist">Open an issue from any active rental&apos;s order page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((req) => (
        <div key={req._id} className="card p-5 flex items-center gap-4">
          <div className="h-12 w-12 shrink-0 rounded bg-sage-50 overflow-hidden">
            {req.product?.images?.[0] && (
              <img src={req.product.images[0]} alt="" className="h-full w-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-ink">{req.product?.title}</p>
            <p className="text-xs text-mist mt-0.5">{ISSUE_LABELS[req.issueType]} · Filed {formatDate(req.createdAt)}</p>
            {req.resolutionNotes && (
              <p className="text-xs text-sage-600 mt-1">{req.resolutionNotes}</p>
            )}
          </div>
          <span className={`chip ${STATUS_COLORS[req.status]}`}>{STATUS_LABELS[req.status]}</span>
        </div>
      ))}
    </div>
  );
};

export default MyMaintenanceRequests;
