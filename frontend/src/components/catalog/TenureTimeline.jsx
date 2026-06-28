import { formatINR } from '../../lib/format.jsx';

/**
 * The core RentEase interaction: choosing how long you keep something.
 * Rendered as a horizontal timeline rather than a plain dropdown or radio
 * list, because the relationship between tenure and price IS the product's
 * value proposition — it should be seen, not just read.
 */
const TenureTimeline = ({ options, selectedMonths, onSelect }) => {
  const sorted = [...options].sort((a, b) => a.months - b.months);
  const maxRent = Math.max(...sorted.map((o) => o.monthlyRent));
  // Discount is computed live from real prices, never stored.
  const baselineRent = sorted[0]?.monthlyRent || 0;

  return (
    <div className="w-full">
      <div className="flex items-stretch gap-2">
        {sorted.map((opt) => {
          const isSelected = opt.months === selectedMonths;
          const barHeight = 18 + (opt.monthlyRent / maxRent) * 26; // 18-44px range
          const savingPercent =
            baselineRent > 0 ? Math.round(((baselineRent - opt.monthlyRent) / baselineRent) * 100) : 0;

          return (
            <button
              key={opt.months}
              type="button"
              onClick={() => onSelect(opt.months)}
              className={`group relative flex-1 rounded-lg border px-3 py-3.5 text-left transition-all duration-150 ${
                isSelected
                  ? 'border-sage-600 bg-sage-600 text-paper shadow-card'
                  : 'border-ink/12 bg-paper hover:border-sage-300'
              }`}
            >
              {savingPercent > 0 && (
                <span
                  className={`absolute -top-2.5 right-2 chip text-[10px] px-1.5 py-0.5 ${
                    isSelected ? 'bg-amber-400 text-ink' : 'bg-amber-100 text-amber-600'
                  }`}
                >
                  −{savingPercent}%
                </span>
              )}

              <p className={`text-xs font-medium mb-2 ${isSelected ? 'text-paper/70' : 'text-mist'}`}>
                {opt.months} {opt.months === 1 ? 'month' : 'months'}
              </p>

              {/* the timeline bar — height encodes relative monthly rent */}
              <div className="flex items-end h-11 mb-2">
                <div
                  className={`w-full rounded-sm transition-all duration-300 ${
                    isSelected ? 'bg-amber-400' : 'bg-sage-200 group-hover:bg-sage-300'
                  }`}
                  style={{ height: `${barHeight}px` }}
                />
              </div>

              <p className={`font-mono text-sm font-semibold leading-none ${isSelected ? 'text-paper' : 'text-ink'}`}>
                {formatINR(opt.monthlyRent)}
                <span className={`text-[11px] font-body font-normal ${isSelected ? 'text-paper/60' : 'text-mist'}`}>
                  /mo
                </span>
              </p>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-mist mt-2.5">
        Shorter bar, lower rent — longer tenures cost less per month.
      </p>
    </div>
  );
};

export default TenureTimeline;
