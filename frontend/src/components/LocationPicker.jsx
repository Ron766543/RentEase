import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, ChevronDown, Check, LoaderCircle, X } from 'lucide-react';
import { useLocationContext, SERVICEABLE_CITIES } from '../context/LocationContext.jsx';
import { GeolocationError, detectCurrentCity } from '../lib/geolocation.jsx';

const LocationPicker = ({ className = '' }) => {
  const { city, source, isServiceable, setCity, clearCity } = useLocationContext();
  const [open, setOpen] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDetect = async () => {
    setError('');
    setDetecting(true);
    try {
      const result = await detectCurrentCity();
      setCity(result.city, 'gps');
      if (!SERVICEABLE_CITIES.includes(result.city)) {
        setError(`We're not in ${result.city} yet — showing all cities instead.`);
      } else {
        setOpen(false);
      }
    } catch (err) {
      if (err instanceof GeolocationError) {
        setError(err.message);
      } else {
        setError('Something went wrong while detecting your location.');
      }
    } finally {
      setDetecting(false);
    }
  };

  const handlePick = (cityName) => {
    setCity(cityName, 'manual');
    setError('');
    setOpen(false);
    setQuery('');
  };

  const filteredCities = SERVICEABLE_CITIES.filter((c) =>
    c.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded px-2.5 py-2 text-sm font-medium text-ink hover:bg-ink/5 transition-colors"
      >
        <MapPin size={16} strokeWidth={1.8} className={city ? 'text-sage-600' : 'text-mist'} />
        <span className="max-w-[120px] truncate">{city || 'Select location'}</span>
        <ChevronDown size={14} className={`text-mist transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-80 card p-4 z-50 animate-fade-up">
          <p className="font-display text-sm font-semibold text-ink mb-1">Deliver to</p>
          <p className="text-xs text-mist mb-3">
            We show pricing and availability for your city.
          </p>

          <button
            type="button"
            onClick={handleDetect}
            disabled={detecting}
            className="flex w-full items-center gap-2.5 rounded-lg border border-sage-200 bg-sage-50 px-3 py-2.5 text-sm font-medium text-sage-700 hover:bg-sage-100 transition-colors disabled:opacity-60 mb-3"
          >
            {detecting ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              <Navigation size={16} strokeWidth={1.8} />
            )}
            {detecting ? 'Detecting your location…' : 'Use my current location'}
          </button>

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 mb-3">
              <p className="text-xs text-amber-600 leading-relaxed flex-1">{error}</p>
              <button onClick={() => setError('')} aria-label="Dismiss" className="text-amber-600 mt-0.5">
                <X size={13} />
              </button>
            </div>
          )}

          <div className="relative mb-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your city"
              className="input text-sm py-2"
            />
          </div>

          <div className="max-h-48 overflow-y-auto -mx-1">
            {filteredCities.length === 0 && (
              <p className="px-1 py-3 text-sm text-mist text-center">No matching cities.</p>
            )}
            {filteredCities.map((c) => (
              <button
                key={c}
                onClick={() => handlePick(c)}
                className="flex w-full items-center justify-between rounded px-2.5 py-2 text-sm text-ink hover:bg-ink/5"
              >
                <span>{c}</span>
                {city === c && <Check size={15} className="text-sage-600" />}
              </button>
            ))}
          </div>

          {city && (
            <button
              onClick={() => { clearCity(); setOpen(false); }}
              className="w-full mt-2 pt-2 border-t border-ink/8 text-xs font-medium text-mist hover:text-ink"
            >
              Clear and show all cities
            </button>
          )}

          {source === 'gps' && city && isServiceable && (
            <p className="text-[11px] text-mist mt-2 flex items-center gap-1">
              <Navigation size={11} /> Detected from your current location
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
