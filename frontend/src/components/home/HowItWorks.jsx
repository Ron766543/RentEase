import { Search, CalendarCheck, Wrench, RotateCcw } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Browse & choose your tenure",
    description:
      "Pick furniture or appliances and select how many months you need them for.",
    accent: "bg-sage-600",
  },
  {
    icon: CalendarCheck,
    title: "Schedule delivery",
    description:
      "Choose a delivery date and time slot that fits your move-in plans.",
    accent: "bg-amber-400",
  },
  {
    icon: Wrench,
    title: "Use it, worry-free",
    description:
      "Free maintenance support is included for the entire rental period.",
    accent: "bg-sage-600",
  },
  {
    icon: RotateCcw,
    title: "Return, extend, or swap",
    description:
      "Schedule a pickup when you are done, or extend your tenure in a few taps.",
    accent: "bg-amber-400",
  },
];

const HowItWorks = () => (
  <section className="bg-paper-dim py-16 sm:py-20">
    <div className="container-page">
      <div className="mb-10 sm:mb-12 text-center max-w-lg mx-auto">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
          How RentEase works
        </h2>
        <p className="text-sm sm:text-base text-mist mt-2">
          Four steps from browsing to settling in.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {STEPS.map((step, i) => (
          <div
            key={step.title}
            className="card relative p-6 hover:shadow-lift hover:-translate-y-0.5 transition-all duration-200"
          >
            <span className="absolute top-4 right-4 font-mono text-xs font-semibold text-ink/20">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${step.accent} text-paper mb-5`}
            >
              <step.icon size={22} strokeWidth={1.8} />
            </div>
            <h3 className="font-display text-base font-semibold text-ink mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-mist leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
