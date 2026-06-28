import { Link } from 'react-router-dom';
import { CATEGORY_LABELS, SUBCATEGORY_LABELS } from '../../lib/format.jsx';
import { CategoryIcon } from '../../icons/CategoryIcons.jsx';

const FEATURED_SUBCATEGORIES = [
  { key: 'bed', category: 'furniture' },
  { key: 'sofa', category: 'furniture' },
  { key: 'wardrobe', category: 'furniture' },
  { key: 'fridge', category: 'appliances' },
  { key: 'washing-machine', category: 'appliances' },
  { key: 'tv', category: 'appliances' },
  { key: 'ac', category: 'appliances' },
  { key: 'dining-table', category: 'furniture' },
];

const CategoryShowcase = () => (
  <section className="container-page py-16">
    <div className="flex items-end justify-between mb-8">
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink">Shop by category</h2>
        <p className="text-sm text-mist mt-1">Everything you need to settle into a new place.</p>
      </div>
      <Link to="/catalog" className="text-sm font-semibold text-sage-600 hover:text-sage-700 hidden sm:block">
        View all →
      </Link>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {FEATURED_SUBCATEGORIES.map(({ key, category }) => {
        return (
          <Link
            key={key}
            to={`/catalog?category=${category}&subCategory=${key}`}
            className="group card p-5 flex flex-col items-center text-center gap-3 hover:shadow-lift hover:border-sage-200 transition-all"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-50 text-sage-600 group-hover:bg-sage-100 transition-colors">
              <CategoryIcon subCategory={key} className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink">{SUBCATEGORY_LABELS[key] || key}</p>
              <p className="text-xs text-mist">{CATEGORY_LABELS[category]}</p>
            </div>
          </Link>
        );
      })}
    </div>
  </section>
);

export default CategoryShowcase;
