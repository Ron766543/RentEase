import Spinner from './Spinner.jsx';

const PageLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center text-sage-600">
    <Spinner size={32} />
  </div>
);

export default PageLoader;
