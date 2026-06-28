import { Routes, Route, useParams } from 'react-router-dom';

import PublicLayout from './layouts/PublicLayout.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import AccountLayout from './layouts/AccountLayout.jsx';
import { RequireAuth, RequireGuest } from './routes/RouteGuards.jsx';

import { Package, ClipboardList, Wrench, LayoutDashboard, Users, MapPin } from 'lucide-react';

import Home from './pages/customer/Home.jsx';
import Catalog from './pages/customer/Catalog.jsx';
import ProductDetail from './pages/customer/ProductDetail.jsx';
import Cart from './pages/customer/Cart.jsx';
import Checkout from './pages/customer/Checkout.jsx';
import MyRentals from './pages/customer/MyRentals.jsx';
import OrderDetail from './pages/customer/OrderDetail.jsx';
import MyMaintenanceRequests from './pages/customer/MyMaintenanceRequests.jsx';
import Profile from './pages/customer/Profile.jsx';
import HowItWorks from './pages/HowItWorks.jsx';
import NotFound from './pages/NotFound.jsx';

import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';

import VendorDashboard from './pages/vendor/VendorDashboard.jsx';
import VendorProducts from './pages/vendor/VendorProducts.jsx';
import ProductForm from './pages/vendor/ProductForm.jsx';
import VendorOrders from './pages/vendor/VendorOrders.jsx';
import VendorOrderDetail from './pages/vendor/VendorOrderDetail.jsx';
import VendorMaintenance from './pages/vendor/VendorMaintenance.jsx';

import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminServiceAreas from './pages/admin/AdminServiceAreas.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import AdminMaintenance from './pages/admin/AdminMaintenance.jsx';

// Keys ProductDetail by slug so switching between products fully remounts
// the page instead of reusing the same instance with stale state.
const ProductDetailWithKey = () => {
  const { slug } = useParams();
  return <ProductDetail key={slug} />;
};

const vendorNavItems = [
  { to: '/vendor', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/vendor/products', label: 'Products', icon: Package },
  { to: '/vendor/orders', label: 'Orders', icon: ClipboardList },
  { to: '/vendor/maintenance', label: 'Maintenance', icon: Wrench },
];

const adminNavItems = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { to: '/admin/maintenance', label: 'Maintenance', icon: Wrench },
  { to: '/admin/service-areas', label: 'Service areas', icon: MapPin },
];

export default function App() {
  return (
    <Routes>
      {/* Public / customer storefront */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:slug" element={<ProductDetailWithKey />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/how-it-works" element={<HowItWorks />} />

        <Route element={<RequireGuest />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<RequireAuth roles={['customer']} />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/account" element={<AccountLayout />}>
            <Route path="orders" element={<MyRentals />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="maintenance" element={<MyMaintenanceRequests />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Route>

      {/* Vendor dashboard */}
      <Route element={<RequireAuth roles={['vendor', 'admin']} />}>
        <Route element={<DashboardLayout navItems={vendorNavItems} title="Vendor dashboard" />}>
          <Route path="/vendor" element={<VendorDashboard />} />
          <Route path="/vendor/products" element={<VendorProducts />} />
          <Route path="/vendor/products/new" element={<ProductForm />} />
          <Route path="/vendor/products/:id/edit" element={<ProductForm />} />
          <Route path="/vendor/orders" element={<VendorOrders />} />
          <Route path="/vendor/orders/:id" element={<VendorOrderDetail />} />
          <Route path="/vendor/maintenance" element={<VendorMaintenance />} />
        </Route>
      </Route>

      {/* Admin dashboard */}
      <Route element={<RequireAuth roles={['admin']} />}>
        <Route element={<DashboardLayout navItems={adminNavItems} title="Admin dashboard" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/maintenance" element={<AdminMaintenance />} />
          <Route path="/admin/service-areas" element={<AdminServiceAreas />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
