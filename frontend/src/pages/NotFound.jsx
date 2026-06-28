import { Link } from 'react-router-dom';
import { BrandMark } from '../icons/Logo.jsx';

const NotFound = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
    <BrandMark className="h-12 w-12 mb-5 opacity-80" />
    <h1 className="font-display text-3xl font-semibold text-ink">Page not found</h1>
    <p className="text-mist mt-2 mb-6">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
    <Link to="/" className="btn-primary">Back to home</Link>
  </div>
);

export default NotFound;
