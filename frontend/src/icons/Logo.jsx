// House + clock mark: a home you live in for a measured time, not forever.

export const BrandMark = ({ className = 'h-8 w-8' }) => (
  <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="16" fill="#15201B" />
    <path
      d="M14 30L32 16l18 14"
      stroke="#FAF7F0"
      strokeWidth="4.2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 27v19a2 2 0 0 0 2 2h22a2 2 0 0 0 2-2V27"
      stroke="#FAF7F0"
      strokeWidth="4.2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="32" cy="38" r="8.5" fill="#15201B" stroke="#FF7A33" strokeWidth="3" />
    <path
      d="M32 34v4.2l3.2 1.8"
      stroke="#FF7A33"
      strokeWidth="2.4"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Logo = ({ className = '', markClassName = 'h-8 w-8' }) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    <BrandMark className={markClassName} />
    <span className="font-display font-semibold text-lg text-ink tracking-tight">
      RentEase
    </span>
  </div>
);
