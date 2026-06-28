import { CATEGORY_LABELS, SUBCATEGORY_LABELS } from '../../lib/format.jsx';
import { CategoryIcon } from '../../icons/CategoryIcons.jsx';
import { useLocationContext, SERVICEABLE_CITIES } from '../../context/LocationContext.jsx';
import { MapPin } from 'lucide-react';

const FILTER_GROUPS = {
  furniture: ['bed', 'sofa', 'table', 'wardrobe', 'dining-table', 'armchair', 'bookshelf', 'bunk-bed'],
  appliances: ['fridge', 'washing-machine', 'tv', 'ac', 'microwave'],
};

const CatalogFilters = ({ filters, onChange }) => {
  const set = (patch) => onChange({ ...filters, ...patch });
  const { city: locationCity, setCity, clearCity } = useLocationContext();

  return (
    <div className="space-y-6">
      <div>
        <p className="label">Category</p>
        <div className="space-y-1.5">
          <button
            onClick={() => set({ category: '', subCategory: '' })}
            className={`block w-full text-left rounded px-2.5 py-1.5 text-sm ${
              !filters.category ? 'bg-sage-100 text-sage-700 font-medium' : 'text-ink/70 hover:bg-ink/5'
            }`}
          >
            All categories
          </button>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => set({ category: key, subCategory: '' })}
              className={`block w-full text-left rounded px-2.5 py-1.5 text-sm ${
                filters.category === key ? 'bg-sage-100 text-sage-700 font-medium' : 'text-ink/70 hover:bg-ink/5'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filters.category && (
        <div>
          <p className="label">Type</p>
          <div className="space-y-1.5">
            {FILTER_GROUPS[filters.category].map((sub) => {
              return (
                <button
                  key={sub}
                  onClick={() => set({ subCategory: filters.subCategory === sub ? '' : sub })}
                  className={`flex w-full items-center gap-2 text-left rounded px-2.5 py-1.5 text-sm ${
                    filters.subCategory === sub ? 'bg-sage-100 text-sage-700 font-medium' : 'text-ink/70 hover:bg-ink/5'
                  }`}
                >
                  <CategoryIcon subCategory={sub} className="h-4 w-4" />
                  {SUBCATEGORY_LABELS[sub] || sub}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <p className="label">Monthly rent</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => set({ minPrice: e.target.value })}
            className="input text-sm"
          />
          <span className="text-mist">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => set({ maxPrice: e.target.value })}
            className="input text-sm"
          />
        </div>
      </div>

      <div>
        <p className="label">City</p>
        {locationCity ? (
          <div className="flex items-center justify-between rounded border border-sage-200 bg-sage-50 px-3 py-2.5">
            <span className="flex items-center gap-1.5 text-sm font-medium text-sage-700">
              <MapPin size={15} className="text-sage-600" />
              {locationCity}
            </span>
            <button
              onClick={() => { clearCity(); set({ city: '' }); }}
              className="text-xs font-medium text-sage-600 hover:text-sage-700"
            >
              Change
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-1.5">
            {SERVICEABLE_CITIES.map((c) => (
              <button
                key={c}
                onClick={() => { setCity(c, 'manual'); set({ city: c }); }}
                className="flex items-center gap-1.5 rounded px-2.5 py-1.5 text-sm text-ink/70 hover:bg-ink/5 text-left"
              >
                <MapPin size={14} className="text-mist" />
                {c}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogFilters;
