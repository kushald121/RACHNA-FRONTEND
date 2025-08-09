import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from "react-helmet"; //browser tab and icon customization
import { AuthProvider } from './contexts/AuthContext';
import { SearchProvider } from './contexts/SearchContext';
import Payment from "./pages/home/payment"
import PaymentPage from "./pages/payment/PaymentPage.js";
import AddressPage from "./pages/checkout/AddressPage.js";
import OrderSummaryPage from "./pages/checkout/OrderSummaryPage.js";
import OrdersPage from "./pages/orders/OrdersPage.js";
import User1 from "./pages/user/User1.js";
import UserLogin from './pages/user/UserLogin.js';
import AdminLogin from './pages/admin/AdminLogin.js';
import Fav from '../src/pages/favorites/Fav.js';
import AdminProductPages from './pages/product/AdminProductPages.js';
import ProductOverview from './pages/product/ProductOverview.js';
import DynamicProductOverview from './pages/product/DynamicProductOverview.js';
import AdminControl from "./pages/admin/adminControl.js";
import ProtectedRoutes from "./pages/utils/ProtectedRoutes.js";
import AddProduct from "./pages/admin/Addproduct.jsx";
import DeleteProduct from "./pages/admin/DeleteProduct.js";
import UpdateProduct from "./pages/admin/UpdateProduct.js";
import ViewOrder from "./pages/admin/ViewOrder.jsx";
import PrivacyPolicy from './pages/footer/privacypolicy.js';
import TermsCondtion from "./pages/footer/termsandcondition.js"
import AllProductsPage from './pages/product/AllProductsPage.jsx';
import ContactUs from './pages/footer/contactus.js';
import RefundPolicy from './pages/footer/refund.js';
import ShippingDelivery from "./pages/footer/shippinganddelivery.js";
import Accessibility from "./pages/footer/Accessibilty.js";
import ComingSoonPage from './pages/collections/ComingSoonPage.js';
import ForgotPassword from './pages/user/ForgotPassword.js';
import AboutUs from './pages/about/AboutUs.js';

// Core Function
import { Home, Error } from './pages';


const App = () => {
  return (
    <AuthProvider>
      <Router> {/* Move the Router component here */}
        <SearchProvider>
          <div className="App">
        {/*Website TAB Description*/}
        <Helmet>
          <meta charSet="utf-8" />
          <title>Rachna - Modern Collection for Men's & Women's Clothing</title>
          <link rel="canonical" href="https://www.google.com/" />
          <meta name="description" content="© 2023 Rachna Inc. All Rights Reserved." />
        </Helmet>
         {/* //<SplashCursor/> */}

        <Routes>
          <Route exact path="/Rachna/" element={<Home />} />
          {/* Payment */}
          <Route path ="/Rachna/payment"  element={<PaymentPage/>}/>
          <Route path ="/Rachna/old-payment"  element={<Payment/>}/>
          <Route path ="/Rachna/address"  element={<AddressPage/>}/>
          <Route path ="/Rachna/order-summary"  element={<OrderSummaryPage/>}/>
          <Route path ="/Rachna/checkout"  element={<PaymentPage/>}/>
          <Route path ="/Rachna/orders"  element={<OrdersPage/>}/>



          {/* User Authentication */}
          <Route path="/Rachna/user-login/" element={<UserLogin />} />
          <Route path="/Rachna/sign-in/" element={<UserLogin />} />
          <Route path="/Rachna/sign-up/" element={<UserLogin />} />
          <Route path="/Rachna/forgot-password/" element={<ForgotPassword />} />

          {/* Admin Login (Not Protected - Users need access to login) */}
          <Route path="/Rachna/admin-login/" element={<AdminLogin />} />

          {/* Protected Admin Routes - Only accessible after admin login */}
          <Route element={<ProtectedRoutes/>}>
            <Route element={<AdminControl/>} path="/Rachna/admincontrol" />
            <Route element={<AddProduct/>} path="/Rachna/addproduct"/>
            <Route element={<DeleteProduct/>} path="/Rachna/deleteproduct"/>
            <Route element={<UpdateProduct/>} path="/Rachna/updateproduct"/>
            <Route element={<ViewOrder/>} path="/Rachna/vieworders"/>
            <Route element={<AdminProductPages />} path="/Rachna/productpages"/>

          </Route>

          {/* Public Routes */}
          <Route path="/Rachna/error/" element={<Error />} />
          <Route path="/Rachna/about-us/" element={<AboutUs />} />
          <Route path="/Rachna/favorites/" element={<Fav />} />
          <Route path="/Rachna/productoverview/" element={<ProductOverview />} />
          <Route path="/Rachna/product/:productId" element={<DynamicProductOverview />} />
          <Route path="/Rachna/allproducts/" element={<AllProductsPage/>} />
          <Route path="/Rachna/coming-soon/" element={<ComingSoonPage/>} />

          <Route path="/Rachna/user1" element={<User1/>}/>

          {/* Footer */}
          <Route path= "/Rachna/privacypolicy" element={<PrivacyPolicy/>}/>
          <Route path= "/Rachna/termsandcondition" element={<TermsCondtion/>}/>
          <Route path= "/Rachna/contactus" element={<ContactUs/>}/>
           <Route path="/Rachna/refundpolicy" element={<RefundPolicy/>}/>
          <Route path="/Rachna/shipping&delivery" element={<ShippingDelivery/>}/>
          <Route path="/Rachna/accessibility" element={<Accessibility/>}/>

        </Routes>
        </div>
        </SearchProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
