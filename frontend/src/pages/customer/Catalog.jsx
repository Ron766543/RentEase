import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, MapPin } from 'lucide-react';
import api from '../../lib/api.jsx';
import ProductCard from '../../components/catalog/ProductCard.jsx';
import CatalogFilters from '../../components/catalog/CatalogFilters.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useLocationContext } from '../../context/LocationContext.jsx';

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { city: globalCity } = useLocationContext();

  // Filters are derived from the URL on every render, not copied into
  // useState, so links that only change the query string still update this page.
  const filters = useMemo(
    () => ({
      category: searchParams.get('category') || '',
      subCategory: searchParams.get('subCategory') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      // Defaults to the site-wide city selected via the header.
      city: searchParams.get('city') || globalCity || '',
      sort: searchParams.get('sort') || 'newest',
      search: searchParams.get('search') || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams]
  );

  const updateFilters = useCallback(
    (patch) => {
      const next = typeof patch === 'function' ? patch(filters) : { ...filters, ...patch };
      const params = {};
      Object.entries(next).forEach(([key, value]) => {
        if (value) params[key] = value;
      });
      setSearchParams(params, { replace: true });
    },
    [filters, setSearchParams]
  );

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const fetchProducts = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 12 };
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = value;
      });
      if (!params.city && globalCity) params.city = globalCity;
      const { data } = await api.get('/products', { params });
      setItems(data.items);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, globalCity]);

  useEffect(() => {
    (() => {
      fetchProducts(1);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const activeFilterCount = [filters.category, filters.subCategory, filters.minPrice, filters.maxPrice].filter(Boolean).length;

  return (
    <div className="container-page py-8">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Browse the catalog</h1>
          <p className="text-sm text-mist mt-1 flex items-center gap-1.5">
            {filters.city ? (
              <>
                <MapPin size={14} className="text-sage-600" />
                Showing items deliverable to {filters.city}
              </>
            ) : (
              'Set your city to see what we can deliver to you'
            )}
          </p>
        </div>

        <select
          value={filters.sort}
          onChange={(e) => updateFilters({ sort: e.target.value })}
          className="input text-sm w-auto hidden sm:block"
        >
          <option value="newest">Newest</option>
          <option value="price_low">Price: Low to high</option>
          <option value="price_high">Price: High to low</option>
          <option value="rating">Top rated</option>
        </select>
      </div>

      <button
        className="md:hidden btn-outline w-full mb-5"
        onClick={() => setMobileFiltersOpen(true)}
      >
        <SlidersHorizontal size={16} />
        Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        <aside className="hidden md:block">
          <CatalogFilters filters={filters} onChange={updateFilters} />
        </aside>

        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-ink/40" onClick={() => setMobileFiltersOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-paper p-5 overflow-y-auto animate-fade-up">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-ink">Filters</h2>
                <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                  <X size={20} />
                </button>
              </div>
              <CatalogFilters filters={filters} onChange={updateFilters} />
              <button className="btn-primary w-full mt-6" onClick={() => setMobileFiltersOpen(false)}>
                Show results
              </button>
            </div>
          </div>
        )}

        <div>
          {loading ? (
            <div className="flex justify-center py-24"><Spinner size={28} /></div>
          ) : error ? (
            <p className="text-center text-red-600 py-24">{error}</p>
          ) : items.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-display text-lg text-ink mb-1">No products match your filters</p>
              <p className="text-sm text-mist">Try adjusting your category, price range, or city.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => fetchProducts(p)}
                      className={`h-9 w-9 rounded text-sm font-medium ${
                        pagination.page === p ? 'bg-sage-600 text-paper' : 'text-ink/70 hover:bg-ink/5'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
