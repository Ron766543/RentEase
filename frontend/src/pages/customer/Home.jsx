import { Link } from 'react-router-dom';
import Hero from '../../components/home/Hero.jsx';
import CategoryShowcase from '../../components/home/CategoryShowcase.jsx';
import FeaturedCarousel from '../../components/home/FeaturedCarousel.jsx';
import HowItWorks from '../../components/home/HowItWorks.jsx';
import AudienceSection from '../../components/home/AudienceSection.jsx';

const Home = () => (
  <div>
    <Hero />
    <CategoryShowcase />
    <FeaturedCarousel />
    <HowItWorks />
    <AudienceSection />

    <section className="container-page pb-20">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-sage-600 to-sage-800 p-10 sm:p-14 text-center">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-amber-400/10" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-paper/5" />
        <div className="relative">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-paper">
            Ready to furnish your next place?
          </h2>
          <p className="text-paper/70 mt-3 max-w-lg mx-auto">
            Browse the catalog, pick a tenure, and schedule delivery — all in
            one sitting.
          </p>
          <Link to="/catalog" className="btn-primary mt-7 inline-flex px-7 py-3 text-base">
            Start browsing
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default Home;
