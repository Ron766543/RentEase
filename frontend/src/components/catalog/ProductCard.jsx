import { Link } from 'react-router-dom';
import { formatINR } from '../../lib/format.jsx';
import { CategoryIcon } from '../../icons/CategoryIcons.jsx';

const ProductCard = ({ product }) => {
  const cheapestTenure = [...product.tenureOptions].sort((a, b) => a.monthlyRent - b.monthlyRent)[0];
  const isOut = product.availableUnits === 0;

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group card overflow-hidden flex flex-col hover:shadow-lift transition-shadow duration-200"
    >
      <div className="relative aspect-[4/3] bg-sage-50 flex items-center justify-center overflow-hidden">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : null}
        <CategoryIcon subCategory={product.subCategory} className="absolute h-12 w-12 text-sage-300 -z-0" style={{ display: product.images?.[0] ? 'none' : 'block' }} />
        {isOut && (
          <span className="absolute top-3 left-3 chip bg-ink text-paper">Currently unavailable</span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 text-xs text-mist mb-1">
          <CategoryIcon subCategory={product.subCategory} className="h-3.5 w-3.5" />
          <span>{product.brand || 'RentEase'}</span>
        </div>
        <h3 className="font-display text-[15px] font-medium text-ink leading-snug mb-2 line-clamp-2">
          {product.title}
        </h3>

        <div className="mt-auto pt-2 flex items-end justify-between">
          <div>
            <p className="font-mono text-lg font-semibold text-ink leading-none">
              {formatINR(cheapestTenure?.monthlyRent)}
              <span className="text-xs font-body font-normal text-mist">/mo</span>
            </p>
            <p className="text-xs text-mist mt-1">
              From {cheapestTenure?.months}-month tenure
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
