import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Search,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  Eye,
  ArrowRight,
  Tag,
  BookOpen,
  Award,
  TrendingUp,
  Sparkles,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Toast Component
const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down">
      <div
        className={`
        flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg border
        ${
          type === "success"
            ? "bg-green-50 text-green-800 border-green-200"
            : "bg-red-50 text-red-800 border-red-200"
        }
        min-w-[300px] max-w-md backdrop-blur-sm
      `}
      >
        {type === "success" ? (
          <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
        ) : (
          <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
        )}
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-auto text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [booksByCategory, setBooksByCategory] = useState({});
  const [latestBooks, setLatestBooks] = useState([]);
  const [hindiBooks, setHindiBooks] = useState([]);
  const [englishBooks, setEnglishBooks] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booksLoading, setBooksLoading] = useState(true);
  const [featuredBooksLoading, setFeaturedBooksLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlideIndices, setCurrentSlideIndices] = useState({
    latest: 0,
    hindi: 0,
    english: 0,
  });
  const [currentFeaturedBook, setCurrentFeaturedBook] = useState(0);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  // User profile images for the circles
  const userProfiles = [
    "https://i.postimg.cc/Y0rnSt6q/Chat-GPT-Image-Nov-25-2025-10-50-27-AM.png",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
    "https://i.postimg.cc/Y0dXGTRH/Chat-GPT-Image-Nov-25-2025-10-51-00-AM.png",
  ];

  // Background images for promo boxes
  const promoBackgrounds = {
    newPublications:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    historySale:
      "https://images.stockcake.com/public/5/b/1/5b16cd96-8b6f-4e5f-a38a-7d8dbd520b8f_large/ancient-opened-book-stockcake.jpg",
    topRated:
      "https://m.media-amazon.com/images/S/aplus-media/sc/2ce7adda-89e2-4bb9-ba9c-da55e052226e.__CR367,0,2229,1672_PT0_SX800_V1___.jpg",
  };

  // Quote section background
  const quoteBackground =
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";

  // Stats data
  const stats = [
    {
      label: "Books Available",
      value: "500+",
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      label: "Happy Readers",
      value: "10K+",
      icon: Heart,
      color: "text-red-500",
    },
    { label: "Top Rated", value: "4.8★", icon: Award, color: "text-amber-500" },
    {
      label: "Fast Delivery",
      value: "24hr",
      icon: Clock,
      color: "text-green-600",
    },
  ];

  // Categories to display with their routes and images
  const categories = [
    {
      name: "Biography",
      route: "/collections/biography",
      image: "https://i.postimg.cc/HLvRsJ6m/Fiction.png",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
    },
    {
      name: "Military & Defence",
      route: "/collections/science",
      image:
        "https://i.postimg.cc/85F3F109/groovy-back-to-school-clipart-science-book-illustration-in-trendy-retro-y2k-style-png.png",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
    },
    {
      name: "History",
      route: "/collections/history",
      image: "https://i.postimg.cc/nzs5sHP6/history.png",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
    },
    {
      name: "Self-Help",
      route: "/collections/self-help",
      image:
        "https://i.postimg.cc/PxLcLtR0/pngtree-ancient-vintage-mystery-book-with-ornate-details-png-image-14657244.png",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
    },
    {
      name: "Religious",
      route: "/collections/religious",
      image: "https://i.postimg.cc/9M4S4Wk0/romance.png",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-gradient-to-br from-pink-50 to-rose-50",
    },
  ];

  // Fetch latest books
  const fetchLatestBooks = async () => {
    try {
      setBooksLoading(true);
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/books?page=1&limit=18&sort=createdAt&order=desc`
      );
      const data = await response.json();

      if (data.success) {
        setLatestBooks(data.data.books || []);
      } else {
        throw new Error(data.message || "Failed to fetch latest books");
      }
    } catch (err) {
      console.error("Error fetching latest books:", err);
      setError("Failed to load latest books");
    } finally {
      setBooksLoading(false);
    }
  };

  // Fetch latest hindi books
  const fetchHindiBooks = async () => {
    try {
      setBooksLoading(true);
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/books?page=2&limit=18&sort=createdAt&order=desc`
      );
      const data = await response.json();

      if (data.success) {
        setHindiBooks(data.data.books || []);
      } else {
        throw new Error(data.message || "Failed to fetch latest hindibooks");
      }
    } catch (err) {
      console.error("Error fetching latest hindi books:", err);
      setError("Failed to load latest books");
    } finally {
      setBooksLoading(false);
    }
  };

  // Fetch English books
  const fetchEnglishBooks = async () => {
    try {
      setBooksLoading(true);
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/books?page=3&limit=18&sort=createdAt&order=desc`
      );
      const data = await response.json();

      if (data.success) {
        setEnglishBooks(data.data.books || []);
      } else {
        throw new Error(data.message || "Failed to fetch latest englishbooks");
      }
    } catch (err) {
      console.error("Error fetching latest english books:", err);
      setError("Failed to load latest books");
    } finally {
      setBooksLoading(false);
    }
  };

  // Fetch featured books using dedicated endpoint
  const fetchFeaturedBooks = async () => {
    try {
      setFeaturedBooksLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/books/featured/books?limit=10`
      );

      const data = await response.json();

      if (data.success) {
        setFeaturedBooks(data.data.books || []);
      } else {
        console.warn(
          "Featured books endpoint failed, using latest books as fallback"
        );
        if (latestBooks.length > 0) {
          setFeaturedBooks(latestBooks.slice(0, 10));
        } else {
          throw new Error("No books available");
        }
      }
    } catch (err) {
      console.error("Error fetching featured books:", err);
      if (latestBooks.length > 0) {
        setFeaturedBooks(latestBooks.slice(0, 10));
      }
    } finally {
      setFeaturedBooksLoading(false);
    }
  };

  // Fetch books for each category
  useEffect(() => {
    const fetchBooksByCategory = async () => {
      try {
        setLoading(true);
        const categoryBooks = {};

        for (const category of categories) {
          try {
            const response = await fetch(
              `${import.meta.env.VITE_API_URL}/api/books/category/${
                category.name
              }?page=1&limit=8`
            );
            const data = await response.json();

            if (data.success) {
              categoryBooks[category.name] = data.data;
            }
          } catch (err) {
            console.error(`Error fetching ${category.name} books:`, err);
          }
        }

        setBooksByCategory(categoryBooks);
      } catch (err) {
        setError("Failed to load books");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooksByCategory();
    fetchLatestBooks();
    fetchHindiBooks();
    fetchEnglishBooks();
  }, []);

  // Fetch featured books when latest books are loaded
  useEffect(() => {
    if (!loading) {
      fetchFeaturedBooks();
    }
  }, [loading]);

  // Auto-rotate featured books
  useEffect(() => {
    if (featuredBooks.length > 1) {
      const interval = setInterval(() => {
        setCurrentFeaturedBook((prev) =>
          prev === featuredBooks.length - 1 ? 0 : prev + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [featuredBooks.length]);

  // Slider navigation functions for different sections
  const nextSlide = (section) => {
    setCurrentSlideIndices((prev) => ({
      ...prev,
      [section]: (prev[section] + 1) % 3,
    }));
  };

  const prevSlide = (section) => {
    setCurrentSlideIndices((prev) => ({
      ...prev,
      [section]: (prev[section] - 1 + 3) % 3,
    }));
  };

  // Get slide books for different sections
  const getSlideBooks = (books, section) => {
    const startIndex = currentSlideIndices[section] * 6;
    const endIndex = startIndex + 6;
    return books.slice(startIndex, endIndex);
  };

  // Featured book navigation
  const nextFeaturedBook = () => {
    setCurrentFeaturedBook((prev) =>
      prev === featuredBooks.length - 1 ? 0 : prev + 1
    );
  };

  const prevFeaturedBook = () => {
    setCurrentFeaturedBook((prev) =>
      prev === 0 ? featuredBooks.length - 1 : prev - 1
    );
  };

  // Get current featured book
  const getCurrentFeaturedBook = () => {
    return featuredBooks[currentFeaturedBook];
  };

  // Get book image URL
  const getBookImageUrl = (book) => {
    return (
      book.images?.find((img) => img.isPrimary)?.url ||
      book.images?.[0]?.url ||
      "/book-placeholder.jpg"
    );
  };

  // Show toast message
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Handle add to cart with authentication check
  const handleAddToCart = async (book, e) => {
    e.stopPropagation();

    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Please login to add items to cart", "error");
      setTimeout(() => {
        navigate("/login", { state: { from: "/home" } });
      }, 1500);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cart/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bookId: book._id,
            quantity: 1,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        showToast(`"${book.title}" added to cart successfully!`, "success");
      } else {
        showToast(data.message || "Failed to add to cart", "error");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      showToast("Failed to add to cart. Please try again.", "error");
    }
  };

  // Book Card Component
  const BookCard = ({ book }) => {
    const discountPercentage =
      book.originalPrice && book.originalPrice > book.price
        ? Math.round(
            ((book.originalPrice - book.price) / book.originalPrice) * 100
          )
        : null;

    return (
      <div
        className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 cursor-pointer flex flex-col h-full"
        onClick={() => navigate(`/products/${book._id}`)}
      >
        <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          <img
            src={getBookImageUrl(book)}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Shadow overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Ribbon Discount Tag */}
          {discountPercentage && (
            <div className="absolute top-0 left-0 z-20">
              <div className="relative bg-gradient-to-r from-red-500 to-pink-600 text-white py-1 px-4 text-xs font-bold shadow-lg">
                {discountPercentage}% OFF
                <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[10px] border-l-transparent border-b-[10px] border-b-white transform translate-x-full"></div>
              </div>
            </div>
          )}

          {/* Format Badge - Top Right */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md border border-gray-200 z-10">
            {book.format || "Paperback"}
          </div>

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              className="bg-white text-gray-900 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/products/${book._id}`);
              }}
            >
              <Eye size={16} />
              Quick Preview
            </button>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="mb-3">
            <h3 className="font-bold text-gray-900 text-base mb-1.5 line-clamp-2 leading-tight group-hover:text-blue-700 transition-colors">
              {book.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-1">
              By {book.author}
            </p>
          </div>

          {/* Rating */}
          {book.rating && (
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={`${
                      i < Math.floor(book.rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-xs text-gray-600 ml-2">
                  {book.rating}
                </span>
              </div>
            </div>
          )}

          <div className="mt-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{book.price}
                  </span>
                  {book.originalPrice && book.originalPrice > book.price && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      ₹{book.originalPrice}
                    </span>
                  )}
                </div>
                {discountPercentage && (
                  <div className="mt-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full inline-flex items-center gap-1">
                    <Tag size={10} />
                    Save ₹{book.originalPrice - book.price}
                  </div>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 group/btn"
              onClick={(e) => handleAddToCart(book, e)}
            >
              <svg
                className="w-4 h-4 group-hover/btn:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-b from-gray-50 to-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading amazing books...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-gradient-to-b from-gray-50 to-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentFeatured = getCurrentFeaturedBook();

  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-white overflow-x-hidden">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Hero Section - Enhanced */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-6">
              <Sparkles size={16} className="text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">
                Discover Your Next Favorite Book
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Where Every Page
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Begins a Journey...
              </span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Explore our vast collection of books across all genres. From
              thrilling adventures to insightful biographies, find your next
              great read.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                className="group bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                onClick={() => navigate("/categories")}
              >
                <span>Browse Collection</span>
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
              <button
                className="group bg-white text-gray-800 px-8 py-4 rounded-xl font-semibold border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                onClick={() => navigate("/collections")}
              >
                <Tag size={20} />
                <span>View Deals</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}
                      >
                        <Icon size={20} className={stat.color} />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-900">
                          {stat.value}
                        </div>
                        <div className="text-xs text-gray-600">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Featured Book Display */}
          <div className="flex-1 w-full max-w-2xl">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 transform hover:scale-[1.02] transition-transform duration-300">
              {featuredBooksLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : currentFeatured ? (
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0 w-48 h-64 bg-white rounded-2xl shadow-xl p-4 flex items-center justify-center group">
                    <img
                      src={getBookImageUrl(currentFeatured)}
                      alt={currentFeatured.title}
                      className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 px-3 py-1 rounded-full mb-4">
                      <TrendingUp size={14} className="text-amber-600" />
                      <span className="text-xs font-semibold text-amber-700">
                        FEATURED BOOK
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {currentFeatured.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      by{" "}
                      <span className="font-medium">
                        {currentFeatured.author}
                      </span>
                    </p>

                    <p className="text-sm text-gray-500 mb-6 line-clamp-3">
                      {currentFeatured.about ||
                        "A must-read masterpiece from our curated collection."}
                    </p>

                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-gray-900">
                          ₹{currentFeatured.price?.toFixed(2) || ""}
                        </span>
                        {currentFeatured.originalPrice &&
                          currentFeatured.originalPrice >
                            currentFeatured.price && (
                            <span className="text-lg text-gray-500 line-through">
                              ₹{currentFeatured.originalPrice.toFixed(2)}
                            </span>
                          )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                        onClick={() =>
                          navigate(`/products/${currentFeatured._id}`)
                        }
                      >
                        <Eye size={18} />
                        View Details
                      </button>
                      <button
                        className="flex-1 bg-white text-gray-800 px-6 py-3 rounded-xl font-semibold border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                        onClick={(e) => handleAddToCart(currentFeatured, e)}
                      >
                        <ShoppingBag size={18} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No featured books available
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            {featuredBooks.length > 1 && (
              <>
                <div className="flex justify-between mt-6">
                  <button
                    className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl hover:bg-gray-50 transition-all duration-300"
                    onClick={prevFeaturedBook}
                  >
                    <ChevronLeft size={20} className="text-gray-700" />
                  </button>
                  <button
                    className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl hover:bg-gray-50 transition-all duration-300"
                    onClick={nextFeaturedBook}
                  >
                    <ChevronRight size={20} className="text-gray-700" />
                  </button>
                </div>

                <div className="flex justify-center mt-6 gap-2">
                  {featuredBooks.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentFeaturedBook === index
                          ? "w-6 bg-gradient-to-r from-blue-600 to-indigo-700"
                          : "bg-gray-300"
                      }`}
                      onClick={() => setCurrentFeaturedBook(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Latest Books Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Latest Arrivals
              </h2>
              <p className="text-gray-600">
                Freshly added books to our collection
              </p>
            </div>
            <button
              className="group flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              onClick={() => navigate("/collections/latest")}
            >
              View All
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>

          {booksLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
          ) : latestBooks.length > 0 ? (
            <>
              <div className="relative">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                  {getSlideBooks(latestBooks, "latest").map((book) => (
                    <BookCard key={book._id} book={book} />
                  ))}
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
                    onClick={() => prevSlide("latest")}
                  >
                    <ChevronLeft size={20} />
                    Previous
                  </button>
                  <div className="flex gap-2">
                    {[0, 1, 2].map((index) => (
                      <button
                        key={index}
                        className={`w-8 h-2 rounded-full transition-all ${
                          currentSlideIndices.latest === index
                            ? "bg-gradient-to-r from-blue-600 to-indigo-700"
                            : "bg-gray-300"
                        }`}
                        onClick={() =>
                          setCurrentSlideIndices((prev) => ({
                            ...prev,
                            latest: index,
                          }))
                        }
                      />
                    ))}
                  </div>
                  <button
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
                    onClick={() => nextSlide("latest")}
                  >
                    Next
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <div className="text-gray-400 mb-4">
                <BookOpen size={48} className="mx-auto" />
              </div>
              <p className="text-gray-500 text-lg">No books available yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Hindi Books Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 rounded-full mb-2">
                <span className="text-sm font-semibold text-amber-700">
                  POPULAR CATEGORY
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Hindi Literature
              </h2>
              <p className="text-gray-600">
                Classic and contemporary Hindi masterpieces
              </p>
            </div>
            <button
              className="group flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              onClick={() => navigate("/collections/hindi")}
            >
              View All
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>

          {booksLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
          ) : hindiBooks.length > 0 ? (
            <>
              <div className="relative">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                  {getSlideBooks(hindiBooks, "hindi").map((book) => (
                    <BookCard key={book._id} book={book} />
                  ))}
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
                    onClick={() => prevSlide("hindi")}
                  >
                    <ChevronLeft size={20} />
                    Previous
                  </button>
                  <div className="flex gap-2">
                    {[0, 1, 2].map((index) => (
                      <button
                        key={index}
                        className={`w-8 h-2 rounded-full transition-all ${
                          currentSlideIndices.hindi === index
                            ? "bg-gradient-to-r from-blue-600 to-indigo-700"
                            : "bg-gray-300"
                        }`}
                        onClick={() =>
                          setCurrentSlideIndices((prev) => ({
                            ...prev,
                            hindi: index,
                          }))
                        }
                      />
                    ))}
                  </div>
                  <button
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
                    onClick={() => nextSlide("hindi")}
                  >
                    Next
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16 bg-white/80 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 text-lg">No Hindi books available</p>
            </div>
          )}
        </div>
      </section>

      {/* English Books Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                English Best Sellers
              </h2>
              <p className="text-gray-600">
                Top-rated English books loved by readers
              </p>
            </div>
            <button
              className="group flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              onClick={() => navigate("/collections/english")}
            >
              View All
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>

          {booksLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
          ) : englishBooks.length > 0 ? (
            <>
              <div className="relative">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                  {getSlideBooks(englishBooks, "english").map((book) => (
                    <BookCard key={book._id} book={book} />
                  ))}
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
                    onClick={() => prevSlide("english")}
                  >
                    <ChevronLeft size={20} />
                    Previous
                  </button>
                  <div className="flex gap-2">
                    {[0, 1, 2].map((index) => (
                      <button
                        key={index}
                        className={`w-8 h-2 rounded-full transition-all ${
                          currentSlideIndices.english === index
                            ? "bg-gradient-to-r from-blue-600 to-indigo-700"
                            : "bg-gray-300"
                        }`}
                        onClick={() =>
                          setCurrentSlideIndices((prev) => ({
                            ...prev,
                            english: index,
                          }))
                        }
                      />
                    ))}
                  </div>
                  <button
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
                    onClick={() => nextSlide("english")}
                  >
                    Next
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 text-lg">
                No English books available
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse By Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our diverse collection organized by genres and interests
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className={`${cat.bgColor} rounded-2xl p-6 text-center cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group`}
                onClick={() => navigate(cat.route)}
              >
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${cat.color} bg-opacity-20 mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{cat.name}</h3>
                <p className="text-sm text-gray-600">
                  {booksByCategory[cat.name]?.pagination.totalBooks || 0} books
                </p>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-1 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full mx-auto"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
              onClick={() => navigate("/categories")}
            >
              Explore All Categories
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${quoteBackground}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80"></div>
            </div>

            <div className="relative z-10 p-8 md:p-12 text-center">
              <div className="inline-block p-3 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                <BookOpen size={24} className="text-white" />
              </div>

              <p className="text-2xl md:text-3xl font-bold text-white italic mb-6 leading-relaxed">
                "I do believe something very magical can happen when you read a
                good book."
              </p>

              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                  JK
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold">J.K. Rowling</p>
                  <p className="text-gray-300 text-sm">
                    Author, Harry Potter Series
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Boxes */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* New Publications */}
            <div
              className="relative rounded-3xl overflow-hidden group cursor-pointer"
              onClick={() => navigate("/collections/latest")}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `url('${promoBackgrounds.newPublications}')`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-900/70 to-teal-700/60"></div>
              </div>

              <div className="relative z-10 p-8 h-64 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                    <Sparkles size={16} className="text-white" />
                    <span className="text-sm font-semibold text-white">
                      NEW ARRIVALS
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    New Publications
                  </h3>
                  <p className="text-white/90">
                    Discover the latest releases in our collection
                  </p>
                </div>

                <button className="inline-flex items-center gap-2 text-white font-semibold group/btn">
                  Explore Now
                  <ArrowRight
                    size={18}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>

            {/* Sale on History books */}
            <div
              className="relative rounded-3xl overflow-hidden group cursor-pointer"
              onClick={() => navigate("/collections/history")}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `url('${promoBackgrounds.historySale}')`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-indigo-800/60"></div>
              </div>

              <div className="relative z-10 p-8 h-64 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                    <Tag size={16} className="text-white" />
                    <span className="text-sm font-semibold text-white">
                      SPECIAL OFFER
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    History Books Sale
                  </h3>
                  <p className="text-white/90">
                    Enjoy special discounts on historical masterpieces
                  </p>
                </div>

                <button className="inline-flex items-center gap-2 text-white font-semibold group/btn">
                  Shop Now
                  <ArrowRight
                    size={18}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>

            {/* Top Rated */}
            <div
              className="relative rounded-3xl overflow-hidden group cursor-pointer"
              onClick={() => navigate("/collections/top-rated")}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `url('${promoBackgrounds.topRated}')`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-900/70 to-red-800/60"></div>
              </div>

              <div className="relative z-10 p-8 h-64 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                    <Award size={16} className="text-white" />
                    <span className="text-sm font-semibold text-white">
                      BEST SELLERS
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Top Rated Books
                  </h3>
                  <p className="text-white/90">
                    Best sellers and highest rated books this week
                  </p>
                </div>

                <button className="inline-flex items-center gap-2 text-white font-semibold group/btn">
                  Browse Collection
                  <ArrowRight
                    size={18}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Start Your Reading Journey Today
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of readers who have found their next favorite book
              with us
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="group bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                onClick={() => navigate("/register")}
              >
                <span>Create Free Account</span>
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
              <button
                className="group bg-white text-gray-800 px-8 py-4 rounded-xl font-semibold border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                onClick={() => navigate("/collections")}
              >
                <BookOpen size={20} />
                <span>Browse Without Account</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
