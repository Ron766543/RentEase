import { GraduationCap, Users, Home, Wallet } from 'lucide-react';

const AUDIENCES = [
  {
    icon: GraduationCap,
    title: 'Bachelors & students',
    text: 'A bed, a desk, a fridge — just the essentials, on a budget that fits a single income.',
  },
  {
    icon: Users,
    title: 'Couples starting out',
    text: 'Furnish a first home together without locking up savings in furniture you might outgrow.',
  },
  {
    icon: Home,
    title: 'Families',
    text: 'Dining sets, wardrobes, and appliances sized for a full household — built to handle daily use.',
  },
  {
    icon: Wallet,
    title: 'Every budget',
    text: 'From no-frills basics to premium, hotel-grade pieces — tenure pricing for every price point.',
  },
];

const PHOTO =
  'https://images.unsplash.com/photo-1758523670969-dd1b1254062d?q=80&w=1400&auto=format&fit=crop';

const AudienceSection = () => (
  <section className="container-page py-16 lg:py-20">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      <div className="order-2 lg:order-1">
        <span className="chip bg-amber-100 text-amber-600 mb-4">Built for every kind of household</span>
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink leading-tight mb-4">
          Whoever you&apos;re moving for, there&apos;s a plan that fits
        </h2>
        <p className="text-ink/70 leading-relaxed mb-8 max-w-md">
          RentEase isn&apos;t sized for one kind of renter. Whether you&apos;re moving
          into your first studio, setting up a home with a partner, raising
          a family, or simply prefer not to own — the catalog spans every
          tier, from budget-friendly basics to premium pieces.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AUDIENCES.map((a) => (
            <div key={a.title} className="card p-4 hover:shadow-lift hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sage-100 text-sage-600 mb-3">
                <a.icon size={18} strokeWidth={1.8} />
              </div>
              <p className="font-display text-sm font-semibold text-ink mb-1">{a.title}</p>
              <p className="text-xs text-mist leading-relaxed">{a.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="order-1 lg:order-2 relative">
        {/* Decorative accent shape behind the photo for visual depth,
            rather than the image floating on its own. */}
        <div className="absolute -top-4 -right-4 h-full w-full rounded-xl bg-amber-100 -z-10 hidden sm:block" />
        <div className="relative rounded-xl overflow-hidden aspect-[4/3] shadow-lift">
          <img
            src={PHOTO}
            alt="A couple carrying moving boxes into their new home"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="absolute -bottom-5 left-5 right-5 sm:left-8 sm:right-auto sm:w-56 card p-4 shadow-lift">
          <p className="font-mono text-xl font-semibold text-ink">28+</p>
          <p className="text-xs text-mist">items across every category and budget</p>
        </div>
      </div>
    </div>
  </section>
);

export default AudienceSection;
