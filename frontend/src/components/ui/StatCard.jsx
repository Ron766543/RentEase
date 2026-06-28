const StatCard = ({ icon: Icon, label, value, accent = false }) => (
  <div className={`card p-5 ${accent ? 'bg-sage-600 border-none' : ''}`}>
    <div className="flex items-center justify-between mb-3">
      <p className={`text-xs font-medium uppercase tracking-wide ${accent ? 'text-paper/60' : 'text-mist'}`}>
        {label}
      </p>
      {Icon && <Icon size={16} className={accent ? 'text-paper/60' : 'text-sage-500'} />}
    </div>
    <p className={`font-display text-2xl font-semibold ${accent ? 'text-paper' : 'text-ink'}`}>
      {value}
    </p>
  </div>
);

export default StatCard;
