import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
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

const STATUS_FLOW = ['open', 'acknowledged', 'technician_assigned', 'resolved', 'closed'];

const VendorMaintenance = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notesDraft, setNotesDraft] = useState({});

  const fetchRequests = () => {
    api.get('/maintenance/vendor/mine').then(({ data }) => setRequests(data.items)).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const advanceStatus = async (request) => {
    const currentIndex = STATUS_FLOW.indexOf(request.status);
    const next = STATUS_FLOW[currentIndex + 1];
    if (!next) return;
    try {
      await api.patch(`/maintenance/${request._id}`, {
        status: next,
        resolutionNotes: notesDraft[request._id] ?? request.resolutionNotes,
      });
      toast.success(`Marked as ${next.replace(/_/g, ' ')}`);
      fetchRequests();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size={26} /></div>;

  if (requests.length === 0) {
    return <div className="card p-10 text-center text-sm text-mist">No maintenance requests yet.</div>;
  }

  return (
    <div className="space-y-3">
      {requests.map((req) => {
        const currentIndex = STATUS_FLOW.indexOf(req.status);
        const next = STATUS_FLOW[currentIndex + 1];
        return (
          <div key={req._id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-sm font-semibold text-ink">{req.product?.title}</p>
                <p className="text-xs text-mist mt-0.5">
                  {ISSUE_LABELS[req.issueType]} · {req.customer?.name} · Filed {formatDate(req.createdAt)}
                </p>
              </div>
              <span className="chip bg-sage-100 text-sage-700 capitalize">{req.status.replace(/_/g, ' ')}</span>
            </div>
            <p className="text-sm text-ink/80 mb-3">{req.description}</p>

            {req.status !== 'closed' && req.status !== 'resolved' && (
              <div className="flex flex-wrap items-end gap-2">
                <input
                  className="input flex-1 min-w-[200px]"
                  placeholder="Resolution notes (optional)"
                  value={notesDraft[req._id] ?? req.resolutionNotes ?? ''}
                  onChange={(e) => setNotesDraft((d) => ({ ...d, [req._id]: e.target.value }))}
                />
                {next && (
                  <button onClick={() => advanceStatus(req)} className="btn-secondary whitespace-nowrap">
                    Mark as {next.replace(/_/g, ' ')}
                  </button>
                )}
              </div>
            )}
            {req.resolutionNotes && req.status === 'resolved' && (
              <p className="text-sm text-sage-600 mt-1">Resolution: {req.resolutionNotes}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default VendorMaintenance;
