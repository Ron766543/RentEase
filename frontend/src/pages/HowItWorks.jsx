import { Link } from 'react-router-dom';
import { Search, CalendarCheck, Wrench, RotateCcw, ShieldCheck, Truck } from 'lucide-react';

const STEPS = [
  {
    icon: Search,
    title: 'Browse & choose your tenure',
    description:
      'Explore furniture and appliances from verified local vendors. Every listing shows monthly rent for 3, 6, and 12-month tenures — the longer you keep something, the less it costs per month.',
  },
  {
    icon: CalendarCheck,
    title: 'Schedule delivery',
    description:
      'Add items to your cart, enter your delivery address, and pick a date and time slot that fits your move-in schedule. Pay the first month\'s rent plus a refundable security deposit at delivery.',
  },
  {
    icon: Wrench,
    title: 'Use it, worry-free',
    description:
      'If something stops working or needs servicing, raise a maintenance request directly from your order and the vendor will arrange a visit — no extra cost during your active tenure.',
  },
  {
    icon: RotateCcw,
    title: 'Return, extend, or swap',
    description:
      'Done with an item, or moving again? Schedule a pickup in a couple of taps. Want to keep it longer? Extend your tenure right from your order page — no need to reorder.',
  },
];

const ASSURANCES = [
  { icon: ShieldCheck, title: 'Refundable deposits', text: 'Your security deposit is returned after inspection once the item is picked up undamaged.' },
  { icon: Truck, title: 'Doorstep logistics', text: 'Delivery and pickup are scheduled around your availability, not the other way around.' },
  { icon: Wrench, title: 'Maintenance included', text: 'Repairs and servicing during your tenure are handled by the vendor at no extra charge for normal wear.' },
];

const HowItWorks = () => (
  <div className="container-page py-14">
    <div className="max-w-2xl mb-14">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink leading-tight">
        Renting with RentEase, step by step
      </h1>
      <p className="text-ink/70 mt-4 leading-relaxed">
        Built for people who move often — students between semesters, professionals
        between cities — RentEase replaces buying with a flexible monthly plan you
        can extend, shorten, or end whenever your plans change.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
      {STEPS.map((step, i) => (
        <div key={step.title} className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage-600 text-paper">
            <step.icon size={20} strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-xs font-mono text-mist mb-1">Step {i + 1}</p>
            <h3 className="font-display text-base font-semibold text-ink mb-1.5">{step.title}</h3>
            <p className="text-sm text-ink/70 leading-relaxed">{step.description}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-16">
      {ASSURANCES.map((a) => (
        <div key={a.title} className="card p-5">
          <a.icon className="h-6 w-6 text-sage-500 mb-3" strokeWidth={1.6} />
          <h3 className="font-display text-sm font-semibold text-ink mb-1.5">{a.title}</h3>
          <p className="text-sm text-mist leading-relaxed">{a.text}</p>
        </div>
      ))}
    </div>

    <div className="card bg-sage-600 border-none p-10 text-center">
      <h2 className="font-display text-2xl font-semibold text-paper">Ready to get started?</h2>
      <p className="text-paper/70 mt-2 max-w-md mx-auto">
        Pick your city, browse what&apos;s available, and have it delivered this week.
      </p>
      <Link to="/catalog" className="btn-primary mt-6 inline-flex px-7 py-3">
        Browse the catalog
      </Link>
    </div>
  </div>
);

export default HowItWorks;
