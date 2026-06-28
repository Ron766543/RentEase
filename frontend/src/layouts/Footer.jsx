import { Link } from 'react-router-dom';
import { Logo } from '../icons/Logo.jsx';

const Footer = () => (
  <footer className="border-t border-ink/8 bg-ink text-paper/70 mt-20">
    <div className="container-page py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
      <div className="col-span-2">
        <Logo markClassName="h-8 w-8" className="[&>span]:text-paper" />
        <p className="mt-3 text-sm text-paper/55 max-w-xs leading-relaxed">
          Monthly rentals for furniture and appliances, built for people who move often
          and don&apos;t want to buy things twice.
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-paper/40 mb-3">Explore</p>
        <ul className="space-y-2 text-sm">
          <li><Link to="/catalog?category=furniture" className="hover:text-paper">Furniture</Link></li>
          <li><Link to="/catalog?category=appliances" className="hover:text-paper">Appliances</Link></li>
          <li><Link to="/how-it-works" className="hover:text-paper">How it works</Link></li>
        </ul>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-paper/40 mb-3">Company</p>
        <ul className="space-y-2 text-sm">
          <li><Link to="/register?role=vendor" className="hover:text-paper">List your inventory</Link></li>
          <li><Link to="/login" className="hover:text-paper">Sign in</Link></li>
        </ul>
      </div>
    </div>
    <div className="container-page py-5 border-t border-paper/10 text-xs text-paper/40">
      © {new Date().getFullYear()} RentEase. Built for renters who relocate often.
    </div>
  </footer>
);

export default Footer;
