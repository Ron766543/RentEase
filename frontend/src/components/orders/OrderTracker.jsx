import { Check, Clock, Truck, Home, RotateCcw, X } from 'lucide-react';

const STEPS = [
  {
    key: 'pending_confirmation',
    label: 'Order placed',
    icon: Clock,
    copy: 'We have received your order. The vendor typically confirms availability within a few hours.',
  },
  {
    key: 'confirmed',
    label: 'Confirmed',
    icon: Check,
    copy: 'The vendor has confirmed your order and is preparing it for delivery.',
  },
  {
    key: 'out_for_delivery',
    label: 'Out for delivery',
    icon: Truck,
    copy: 'Your items are on the way for the delivery slot you selected at checkout.',
  },
  {
    key: 'active',
    label: 'Delivered & active',
    icon: Home,
    copy: 'Your rental is active. You can request maintenance or extend your tenure any time from this page.',
  },
  {
    key: 'returned',
    label: 'Returned',
    icon: RotateCcw,
    copy: 'This rental has been picked up and closed. Your deposit is refunded after inspection.',
  },
];

const stepIndexForStatus = (status) => {
  if (status === 'return_scheduled') return STEPS.findIndex((s) => s.key === 'returned');
  return STEPS.findIndex((s) => s.key === status);
};

const OrderTracker = ({ status }) => {
  if (status === 'cancelled') {
    return (
      <div className="card p-5 flex items-start gap-3 border-red-200 bg-red-50">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
          <X size={18} />
        </div>
        <div>
          <p className="font-display font-semibold text-ink">Order cancelled</p>
          <p className="text-sm text-ink/70 mt-0.5">
            This order was cancelled and any reserved inventory has been released.
            If you were charged, a refund will be processed to your original payment method.
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = stepIndexForStatus(status);
  const isReturnInProgress = status === 'return_scheduled';
  const currentStep = STEPS[currentIndex];

  return (
    <div className="card p-5">
      <h2 className="font-display font-semibold text-ink mb-5">Order status</h2>

      <div className="flex items-start">
        {STEPS.map((step, i) => {
          const isDone = i < currentIndex;
          const isCurrent = i === currentIndex;

          return (
            <div key={step.key} className="flex-1 flex flex-col items-center text-center relative">
              {i > 0 && (
                <div
                  className={`absolute top-4 right-1/2 w-full h-0.5 -z-10 ${
                    isDone || isCurrent ? 'bg-sage-500' : 'bg-ink/10'
                  }`}
                />
              )}
              <div
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${
                  isDone
                    ? 'bg-sage-600 border-sage-600 text-paper'
                    : isCurrent
                      ? 'bg-amber-400 border-amber-400 text-ink'
                      : 'bg-paper border-ink/15 text-ink/30'
                }`}
              >
                {isDone ? <Check size={15} /> : <step.icon size={15} />}
              </div>
              <p className={`text-[11px] sm:text-xs mt-2 leading-tight ${isCurrent ? 'font-semibold text-ink' : isDone ? 'text-ink/70' : 'text-mist'}`}>
                {isCurrent && isReturnInProgress ? 'Pickup scheduled' : step.label}
              </p>
            </div>
          );
        })}
      </div>

      <p className="text-sm text-ink/70 leading-relaxed mt-6 pt-5 border-t border-ink/8">
        {isReturnInProgress
          ? 'A pickup has been scheduled. Once the vendor collects the item and confirms its condition, this order will move to Returned and your deposit will be refunded.'
          : currentStep?.copy}
      </p>
    </div>
  );
};

export default OrderTracker;
