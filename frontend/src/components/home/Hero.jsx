import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { formatINR } from '../../lib/format.jsx';

const HERO_TENURE = [
  { months: 3, rent: 1299 },
  { months: 6, rent: 1099 },
  { months: 12, rent: 949 },
];

const HERO_PHOTO =
  'https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=1400&auto=format&fit=crop';

const Hero = () => {
  const maxRent = HERO_TENURE[0].rent;

  return (
    <section className="relative overflow-hidden border-b border-ink/8 bg-ink">
      {/* Background photo with a directional gradient wash so text stays
          legible on the left while the photo remains genuinely visible on
          the right, rather than being crushed under a near-opaque overlay. */}
      <div className="absolute inset-0">
        <img
          src={HERO_PHOTO}
          alt=""
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/20" />
      </div>

      <div className="container-page relative py-16 sm:py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
        <div className="animate-fade-up">
          <span className="chip bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/30 mb-5">
            Now in 5 cities across India
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-paper leading-[1.1] tracking-tight">
            Furnish your space.
            <br />
            Keep it only as long as you need it.
          </h1>
          <p className="mt-4 sm:mt-5 text-sm sm:text-base text-paper/70 max-w-md leading-relaxed">
            Rent furniture and appliances by the month — flexible tenures,
            doorstep delivery, free maintenance, and no resale headaches when
            you move again.
          </p>

          <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-3">
            <Link to="/catalog" className="btn-primary text-sm sm:text-base px-5 sm:px-6 py-2.5 sm:py-3">
              Browse the catalog
              <ArrowRight size={18} />
            </Link>
            <Link to="/how-it-works" className="btn-outline !border-paper/25 !text-paper hover:!bg-paper/10 text-sm sm:text-base px-5 sm:px-6 py-2.5 sm:py-3">
              How renting works
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs sm:text-sm text-paper/60">
            <span className="flex items-center gap-1.5"><ShieldCheck size={15} className="text-sage-300" /> Refundable deposits</span>
            <span className="flex items-center gap-1.5"><Truck size={15} className="text-sage-300" /> Doorstep delivery</span>
          </div>
        </div>

        <div className="card p-5 sm:p-7 lg:p-8 animate-fade-up shadow-lift" style={{ animationDelay: '120ms' }}>
          <p className="text-xs font-semibold uppercase tracking-wide text-mist mb-1">
            3-seater fabric sofa
          </p>
          <p className="font-display text-base sm:text-lg font-medium text-ink mb-5 sm:mb-6">
            The longer you keep it, the less it costs each month
          </p>

          <div className="flex items-end gap-3 sm:gap-4 h-32 sm:h-40 mb-4">
            {HERO_TENURE.map((t, i) => {
              const heightPct = (t.rent / maxRent) * 100;
              return (
                <div key={t.months} className="flex-1 flex flex-col items-center gap-2 sm:gap-3">
                  <div className="w-full flex items-end justify-center h-24 sm:h-28">
                    <div
                      className={`w-full max-w-[56px] sm:max-w-[64px] rounded-t-md transition-all ${
                        i === HERO_TENURE.length - 1 ? 'bg-amber-400' : 'bg-sage-300'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-xs sm:text-sm font-semibold text-ink">{formatINR(t.rent)}</p>
                    <p className="text-[11px] sm:text-xs text-mist">{t.months} mo tenure</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-ink/8 pt-4 flex items-center justify-between">
            <p className="text-xs sm:text-sm text-ink/70">Save up to <span className="font-semibold text-sage-600">27%</span> on a 12-month plan</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
