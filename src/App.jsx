import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./components/AllPages/Home/HomePage";
import SingleBookPage from "./components/AllPages/SingleBook/SingleBookPage";
import Cart from "./components/AllPages/CartPages/Cart";
import Login from "./components/Admin/Login";
import SignUp from "./components/Admin/SignUp";
import Policy from "./components/OtherPages/Policy";
import Contacts from "./components/OtherPages/Contact";
import CartAddressDetails from "./components/AllPages/CartPages/CartAddiressDetails";
import PublishBooks from "./components/Admin/BooksManagement/PublishBooks";
import UpdateBooks from "./components/Admin/BooksManagement/UpdateBooks";
import Header from "./components/Header/Header";
import SearchResults from "./components/Header/SearchResults";
import Category from "./components/AllPages/BooksCategory/Category";
import BookCategory from "./components/AllPages/BooksCategory/BookCategory";
import AboutUs from "./components/OtherPages/AboutUs";
import Footer from "./components/Header/Footer"; // Import the Footer component
import OAuthSuccess from "./components/Admin/OAuth/OAuthSuccess";
import Checkout from "./components/AllPages/OrderPages/Checkout";
import OrderSuccess from "./components/AllPages/OrderPages/OrderSuccess";

// Layout component that includes the Header and Footer
const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Routes with Header and Footer */}
          <Route
            path="/"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />

          {/* Categories Listing Page */}
          <Route
            path="/categories"
            element={
              <Layout>
                <Category />
              </Layout>
            }
          />

          <Route
            path="/collections/:category"
            element={
              <Layout>
                <BookCategory />
              </Layout>
            }
          />

          {/* Book Detailed Page */}
          <Route
            path="/products/:id"
            element={
              <Layout>
                <SingleBookPage />
              </Layout>
            }
          />

          {/* Cart page routes */}
          <Route
            path="/viewcart"
            element={
              <Layout>
                <Cart />
              </Layout>
            }
          />
          <Route
            path="/additional-details"
            element={
              <Layout>
                <CartAddressDetails />
              </Layout>
            }
          />

          {/* Admin Routes - No Header/Footer */}
          <Route path="/admin/books/publish" element={<PublishBooks />} />
          <Route
            path="/admin/books/update-book/:id"
            element={<UpdateBooks />}
          />

          {/* User authentication routes */}
          <Route
            path="/login"
            element={
              <Layout>
                <Login />
              </Layout>
            }
          />
          <Route
            path="/sign-up"
            element={
              <Layout>
                <SignUp />
              </Layout>
            }
          />

          {/* Support Pages */}
          <Route
            path="/privacy-policy"
            element={
              <Layout>
                <Policy />
              </Layout>
            }
          />
          <Route
            path="/contact-us"
            element={
              <Layout>
                <Contacts />
              </Layout>
            }
          />

          <Route
            path="/about-us"
            element={
              <Layout>
                <AboutUs />
              </Layout>
            }
          />

          {/* Search */}
          <Route
            path="/search"
            element={
              <Layout>
                <SearchResults />
              </Layout>
            }
          />

          {/* OAuth Routes */}
          <Route path="/oauth-success" element={<OAuthSuccess />} />

          {/* Checkout */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
