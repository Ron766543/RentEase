import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import api from '../../lib/api.jsx';
import ProductCard from '../catalog/ProductCard.jsx';
import Spinner from '../ui/Spinner.jsx';

const FeaturedCarousel = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .get('/products', { params: { sort: 'newest', limit: 8 } })
      .then(({ data }) => {
        if (active) setItems(data.items);
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="container-page py-16">
        <div className="flex justify-center py-12 text-sage-600"><Spinner size={28} /></div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="bg-sage-900 py-16">
      <div className="container-page">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl font-semibold text-paper">Recently added</h2>
            <p className="text-sm text-paper/55 mt-1">Fresh inventory from our verified vendors.</p>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={{ delay: 4500, disableOnInteraction: true }}
          spaceBetween={16}
          slidesPerView={1.15}
          breakpoints={{
            480: { slidesPerView: 1.6, spaceBetween: 18 },
            640: { slidesPerView: 2.2, spaceBetween: 20 },
            1024: { slidesPerView: 3.2, spaceBetween: 20 },
            1280: { slidesPerView: 4, spaceBetween: 24 },
          }}
          className="!pb-2 !px-1 featured-swiper"
        >
          {items.map((product) => (
            <SwiperSlide key={product._id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturedCarousel;
