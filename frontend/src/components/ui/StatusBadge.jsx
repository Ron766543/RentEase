import { STATUS_LABELS, STATUS_COLORS } from '../../lib/format.jsx';

const StatusBadge = ({ status }) => (
  <span className={`chip ${STATUS_COLORS[status] || 'bg-ink/10 text-mist'}`}>
    {STATUS_LABELS[status] || status}
  </span>
);

export default StatusBadge;
