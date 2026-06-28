// Custom hand-built line icon set (not from Lucide or any icon library).

const base = {
  fill: 'none',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const BedIcon = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" {...base} {...props}>
    <path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6" />
    <path d="M3 18v2M21 18v2" />
    <path d="M5 10V7a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3" />
    <path d="M12 10V8a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v4" />
    <path d="M3 14h18" />
  </svg>
);

export const SofaIcon = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" {...base} {...props}>
    <path d="M5 12V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" />
    <path d="M3 12.5A1.5 1.5 0 0 1 4.5 11h15A1.5 1.5 0 0 1 21 12.5V16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
    <path d="M4 17v3M20 17v3" />
    <path d="M7 11V9.5M17 11V9.5" />
  </svg>
);

export const TableIcon = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" {...base} {...props}>
    <path d="M3 8h18" />
    <path d="M5 8v11M19 8v11" />
    <path d="M3 8l1.5-4h15L21 8" />
    <path d="M9 13h6" />
  </svg>
);

export const WardrobeIcon = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" {...base} {...props}>
    <rect x="4" y="3" width="16" height="18" rx="1.2" />
    <path d="M12 3v18" />
    <circle cx="9.5" cy="12" r="0.6" fill="currentColor" stroke="none" />
    <circle cx="14.5" cy="12" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);

export const FridgeIcon = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" {...base} {...props}>
    <rect x="5" y="2.5" width="14" height="19" rx="1.4" />
    <path d="M5 9h14" />
    <path d="M8.5 4.5v3M8.5 11.5v3" />
  </svg>
);

export const WashingMachineIcon = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" {...base} {...props}>
    <rect x="4" y="3" width="16" height="18" rx="1.4" />
    <path d="M4 7h16" />
    <circle cx="7" cy="5" r="0.6" fill="currentColor" stroke="none" />
    <circle cx="9.5" cy="5" r="0.6" fill="currentColor" stroke="none" />
    <circle cx="12" cy="14" r="4.2" />
    <path d="M12 11.3a2.8 2.8 0 0 1 2.3 4.4" />
  </svg>
);

export const TvIcon = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" {...base} {...props}>
    <rect x="3" y="4" width="18" height="12" rx="1.2" />
    <path d="M9 20h6M12 16v4" />
  </svg>
);

export const AcIcon = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" {...base} {...props}>
    <rect x="3" y="6" width="18" height="7" rx="1.6" />
    <path d="M6 16v2M10 16.8v2.4M14 16.8v2.4M18 16v2" />
    <path d="M17 9.5h1.5" />
  </svg>
);

export const MicrowaveIcon = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" {...base} {...props}>
    <rect x="3" y="6" width="18" height="12" rx="1.2" />
    <rect x="5.5" y="8.5" width="9" height="7" rx="0.6" />
    <path d="M18 9v5M16.3 9.5a1.6 1.6 0 0 1 1.7 0M16.3 13.5a1.6 1.6 0 0 0 1.7 0" />
  </svg>
);

export const DiningTableIcon = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" {...base} {...props}>
    <path d="M2.5 9h19" />
    <path d="M4 9V6.8c0-.4.3-.8.8-.8h2.4c.5 0 .8.4.8.8V9" />
    <path d="M16 9V6.8c0-.4.3-.8.8-.8h2.4c.5 0 .8.4.8.8V9" />
    <path d="M5 9v9M19 9v9" />
    <path d="M3 21l2-3M9 21l-2-3M15 21l2-3M21 21l-2-3" />
  </svg>
);

export const ArmchairIcon = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" {...base} {...props}>
    <path d="M6 11V7.5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2V11" />
    <path d="M4 11.5A1.5 1.5 0 0 1 5.5 10h13A1.5 1.5 0 0 1 20 11.5V16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16Z" />
    <path d="M4 13.5h2.5v2.8H4ZM17.5 13.5H20v2.8h-2.5Z" />
    <path d="M6 17.5V20M18 17.5V20" />
  </svg>
);

export const BookshelfIcon = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" {...base} {...props}>
    <rect x="3.5" y="3" width="17" height="18" rx="1" />
    <path d="M3.5 9.5h17M3.5 15h17" />
    <path d="M8 3v6.5M14 9.5V15" />
  </svg>
);

export const BunkBedIcon = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" {...base} {...props}>
    <path d="M3 21V5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v16" />
    <path d="M3 11h16a1 1 0 0 1 1 1v9" />
    <path d="M3 11V8h8v3" />
    <path d="M3 16h12" />
    <path d="M3 21v-2.5M17 21v-2.5" />
  </svg>
);

// Fallback icon for any subCategory without a dedicated one.
export const BoxIcon = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" {...base} {...props}>
    <path d="M3 8.5 12 4l9 4.5-9 4.5-9-4.5Z" />
    <path d="M3 8.5V16l9 4.5 9-4.5V8.5" />
    <path d="M12 13v7.5" />
  </svg>
);

export const CATEGORY_ICON_MAP = {
  bed: BedIcon,
  sofa: SofaIcon,
  table: TableIcon,
  wardrobe: WardrobeIcon,
  fridge: FridgeIcon,
  'washing-machine': WashingMachineIcon,
  tv: TvIcon,
  ac: AcIcon,
  microwave: MicrowaveIcon,
  'dining-table': DiningTableIcon,
  armchair: ArmchairIcon,
  bookshelf: BookshelfIcon,
  'bunk-bed': BunkBedIcon,
};

export const getCategoryIcon = (subCategory) => CATEGORY_ICON_MAP[subCategory] || BoxIcon;

// Renders the icon for a sub-category without holding a component
// reference in a render-time variable.
export const CategoryIcon = ({ subCategory, ...props }) => {
  const Icon = CATEGORY_ICON_MAP[subCategory] || BoxIcon;
  return <Icon {...props} />;
};
