import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
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
  const [currentSlide, setCurrentSlide] = useState({
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

  // Categories to display with their routes and images
  const categories = [
    {
      name: "Biography",
      route: "/collections/biography",
      image:
        "https://thumbs.dreamstime.com/b/book-story-feather-logo-isolated-white-background-simple-vector-413649870.jpg",
      color: "bg-purple-200",
    },
    {
      name: "Military & Defence",
      route: "/collections/science",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/ADGPI_Indian_Army.svg/1280px-ADGPI_Indian_Army.svg.png",
      color: "bg-blue-200",
    },
    {
      name: "History",
      route: "/collections/history",
      image: "https://i.postimg.cc/nzs5sHP6/history.png",
      color: "bg-yellow-100",
    },
    {
      name: "Self-Help",
      route: "/collections/self-help",
      image: "https://www.gipshospital.com/img/detail-85.jpg",
      color: "bg-pink-200",
    },
    {
      name: "Religious",
      route: "/collections/religious",
      image:
        "https://cdn3d.iconscout.com/3d/premium/thumb/diwali-book-3d-icon-png-download-10890251.png",
      color: "bg-pink-100",
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
        }/api/books/hindi/books?page=2&limit=18&sort=createdAt&order=desc`
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
        }/api/books/english/books?page=3&limit=18&sort=createdAt&order=desc`
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

  // Slider navigation for latest books
  const nextSlide = (section) => {
    setCurrentSlide((prev) => ({
      ...prev,
      [section]: (prev[section] + 1) % 3,
    }));
  };

  const prevSlide = (section) => {
    setCurrentSlide((prev) => ({
      ...prev,
      [section]: (prev[section] - 1 + 3) % 3,
    }));
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

  // Get current slide books
  const getCurrentSlideBooks = () => {
    const startIndex = currentSlide.latest * 6;
    const endIndex = startIndex + 6;
    return latestBooks.slice(startIndex, endIndex);
  };
  const getHindiSlideBooks = () => {
    const startIndex = currentSlide.hindi * 6;
    const endIndex = startIndex + 6;
    return hindiBooks.slice(startIndex, endIndex);
  };
  const getEnglishSlideBooks = () => {
    const startIndex = currentSlide.english * 6;
    const endIndex = startIndex + 6;
    return englishBooks.slice(startIndex, endIndex);
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
        key={book._id}
        className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 cursor-pointer flex flex-col h-full"
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

          {/* Triangle Discount Tag - Top Left Corner */}
          {book.originalPrice && book.originalPrice > book.price && (
            <div className="absolute -top-1 -left-1 overflow-hidden w-16 h-16 z-20">
              <div className="absolute bg-gradient-to-br from-orange-500 to-red-600 text-white text-[10px] font-black uppercase w-24 text-center py-1 -rotate-45 -left-6 top-3 shadow-lg">
                {discountPercentage}% OFF
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
                {book.originalPrice && book.originalPrice > book.price && (
                  <div className="mt-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded inline-block">
                    Save ₹{book.originalPrice - book.price}
                  </div>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              className={`w-full py-3 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
                book.stock > 0
                  ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
              onClick={(e) => handleAddToCart(book, e)}
              disabled={book.stock === 0}
            >
              <svg
                className="w-4 h-4"
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
              {book.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-full bg-cream min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-navy mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading amazing books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-cream min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-navy text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90"
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
      {/* Hero Section - UPDATED */}
      <section className="flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-6 bg-gray-300">
        <div className="flex-1 lg:pr-8 text-center lg:text-left mb-8 lg:mb-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-4 leading-tight">
            Where every page begins a journey...
          </h1>
          <p className="text-gray-600 mb-6 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0">
            A huge collection of ebook books based on new curiosity, by search
            answer, about your interest you want.
          </p>
          <button
            className="bg-navy text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 mb-8 transition-colors duration-300"
            onClick={() => navigate("/categories")}
          >
            Get a book →
          </button>

          <div className="flex items-center justify-center lg:justify-start gap-4">
            {/* UPDATED: User profile images instead of empty circles */}
            <div className="flex -space-x-2">
              {userProfiles.map((profile, i) => (
                <img
                  key={i}
                  src={profile}
                  alt={`Happy customer ${i + 1}`}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <div>
              <div className="font-bold text-navy text-sm sm:text-base">
                10K+
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                Happy Customers
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 relative w-full max-w-2xl">
          {/* UPDATED: Book Display Container */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-3xl p-6 sm:p-8 relative z-10 min-h-64 sm:min-h-75 md:min-h-90 flex items-center justify-center">
            {featuredBooksLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
              </div>
            ) : currentFeatured ? (
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full">
                {/* Book Image - Properly displayed without cover/zoom */}
                <div className="flex-shrink-0 w-32 h-40 sm:w-40 sm:h-52 md:w-48 md:h-60 bg-white rounded-lg shadow-lg p-2 flex items-center justify-center">
                  <img
                    src={getBookImageUrl(currentFeatured)}
                    alt={currentFeatured.title}
                    className="w-full h-full object-contain rounded"
                  />
                </div>

                {/* Book Info */}
                <div className="text-center md:text-left max-w-md">
                  <h3 className="text-xl sm:text-2xl font-bold text-navy mb-2 line-clamp-2">
                    {currentFeatured.title}
                  </h3>
                  <p className="text-gray-600 mb-2 text-sm sm:text-base">
                    by {currentFeatured.author}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mb-4 line-clamp-3">
                    {currentFeatured.about ||
                      "Discover this amazing book from our collection."}
                  </p>

                  <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                    <p className="text-xl sm:text-2xl font-bold text-navy">
                      ₹{currentFeatured.price?.toFixed(2) || ""}
                    </p>
                    {currentFeatured.originalPrice &&
                      currentFeatured.originalPrice > currentFeatured.price && (
                        <p className="text-sm text-gray-500 line-through">
                          ₹{currentFeatured.originalPrice.toFixed(2)}
                        </p>
                      )}
                  </div>

                  {/* View Details Button - Now clickable */}
                  <button
                    className="flex items-center bg-navy text-gray-800 underline py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors duration-300 text-sm sm:text-base"
                    onClick={() => navigate(`/products/${currentFeatured._id}`)}
                  >
                    <Eye className="mr-2" size={15}></Eye>
                    View Details
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <p>No featured books available</p>
              </div>
            )}
          </div>

          {/* UPDATED: Navigation Buttons - Fixed positioning */}
          {featuredBooks.length > 1 && (
            <div className="flex justify-between mt-4 z-20 relative">
              <button
                className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-300 rounded-full flex items-center justify-center hover:bg-opacity-90 transition-colors duration-300 shadow-lg"
                onClick={prevFeaturedBook}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-300 rounded-full flex items-center justify-center hover:bg-opacity-90 transition-colors duration-300 shadow-lg"
                onClick={nextFeaturedBook}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* Progress Indicators */}
          {featuredBooks.length > 1 && (
            <div className="flex justify-center mt-4 space-x-2 z-10 relative">
              {featuredBooks.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentFeaturedBook === index
                      ? "bg-gray-600 w-4"
                      : "bg-gray-400"
                  }`}
                  onClick={() => setCurrentFeaturedBook(index)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest Books Slider */}
      <section className="px-8 pt-8 pb-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-navy">Latest Books</h2>
          <div className="flex gap-3">
            <button
              className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
              onClick={() => prevSlide("latest")}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
              onClick={() => nextSlide("latest")}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {booksLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
          </div>
        ) : latestBooks.length > 0 ? (
          <div className="relative">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
              {getCurrentSlideBooks().map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentSlide.latest === index
                      ? "bg-gray-600 w-4"
                      : "bg-gray-400"
                  }`}
                  onClick={() =>
                    setCurrentSlide((prev) => ({ ...prev, latest: index }))
                  }
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No latest books available
          </div>
        )}
      </section>

      {/* Latest Hindi Slider */}
      <section className="px-8 py-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-navy">Hindi Books</h2>
          <div className="flex gap-3">
            <button
              className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
              onClick={() => prevSlide("hindi")}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
              onClick={() => nextSlide("hindi")}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {booksLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
          </div>
        ) : hindiBooks.length > 0 ? (
          <div className="relative">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
              {getHindiSlideBooks().map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentSlide.hindi === index
                      ? "bg-gray-600 w-4"
                      : "bg-gray-400"
                  }`}
                  onClick={() =>
                    setCurrentSlide((prev) => ({ ...prev, hindi: index }))
                  }
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No latest books available
          </div>
        )}
      </section>

      {/* Latest English Books Slider */}
      <section className="px-8 py-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-navy">English Books</h2>
          <div className="flex gap-3">
            <button
              className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
              onClick={() => prevSlide("english")}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
              onClick={() => nextSlide("english")}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {booksLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
          </div>
        ) : englishBooks.length > 0 ? (
          <div className="relative">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
              {getEnglishSlideBooks().map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentSlide.english === index
                      ? "bg-gray-600 w-4"
                      : "bg-gray-400"
                  }`}
                  onClick={() =>
                    setCurrentSlide((prev) => ({ ...prev, english: index }))
                  }
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No latest books available
          </div>
        )}
      </section>

      {/* Featured Categories - Responsive */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy text-center sm:text-left">
            Featured Categories
          </h2>
          <button
            className="text-navy font-medium hover:underline text-sm sm:text-base"
            onClick={() => navigate("/categories")}
          >
            All Categories →
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className={`group ${cat.color} rounded-2xl p-4 sm:p-6 text-center cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 flex flex-col items-center justify-center min-h-32 relative overflow-hidden`}
              onClick={() => navigate(cat.route)}
            >
              {/* Image with scale effect */}
              <div className="relative bg-white w-16 h-16 sm:w-20 sm:h-20 mb-4 overflow-hidden rounded-xl">
                <div
                  className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
                />
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 relative z-10"
                />
              </div>

              <p className="text-sm font-medium text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                {cat.name}
              </p>
              <p className="text-gray-500 text-xs mt-1 group-hover:text-gray-700 transition-colors duration-300">
                {booksByCategory[cat.name]?.pagination.totalBooks || 0} books
              </p>

              {/* Hover indicator line */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-2"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Quote Section - UPDATED with background image */}
      <section
        className="relative text-white px-4 sm:px-6 lg:px-8 py-8 md:py-12 my-8 md:my-12 rounded-2xl mx-4 sm:mx-6 lg:mx-8 overflow-hidden"
        style={{
          backgroundImage: `url('${quoteBackground}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-xl sm:text-2xl md:text-3xl font-bold italic text-center mb-4 leading-relaxed">
            "I do believe something very magical can happen when you read a
            book."
          </p>
          <p className="text-center text-gray-200 text-sm sm:text-base">
            — J.K. Rowling
          </p>
        </div>
      </section>

      {/* Promo Boxes - UPDATED with background images and zoom effect */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* New Publications */}
          <div className="group relative rounded-2xl overflow-hidden min-h-48 cursor-pointer">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{
                backgroundImage: `url('${promoBackgrounds.newPublications}')`,
              }}
            />
            <div className="absolute inset-0 bg-teal-600 bg-opacity-40"></div>
            <div className="relative z-10 p-6 sm:p-8 text-white flex flex-col justify-between min-h-48">
              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">
                  New Publications
                </h3>
                <p className="text-sm mb-4">Discover the latest releases</p>
              </div>
              <button
                onClick={() => navigate("/categories")}
                className="text-white underline text-sm font-medium hover:no-underline"
              >
                Show more →
              </button>
            </div>
          </div>

          {/* Sale on History books */}
          <div className="group relative rounded-2xl overflow-hidden min-h-48 cursor-pointer">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{
                backgroundImage: `url('${promoBackgrounds.historySale}')`,
              }}
            />
            <div className="absolute inset-0 bg-blue-900 bg-opacity-40"></div>
            <div className="relative z-10 p-6 sm:p-8 text-white flex flex-col justify-between min-h-48">
              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">
                  Sale on History books
                </h3>
                <p className="text-sm mb-4">Enjoy special discounts</p>
              </div>
              <button
                onClick={() => navigate("/collections/history")}
                className="text-white underline text-sm font-medium hover:no-underline"
              >
                Shop now →
              </button>
            </div>
          </div>

          {/* Top Rated */}
          <div className="group relative rounded-2xl overflow-hidden min-h-48 cursor-pointer">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{
                backgroundImage: `url('${promoBackgrounds.topRated}')`,
              }}
            />
            <div className="absolute inset-0 bg-red-400 bg-opacity-40"></div>
            <div className="relative z-10 p-6 sm:p-8 text-white flex flex-col justify-between min-h-48">
              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Top Rated</h3>
                <p className="text-sm mb-4">Best sellers this week</p>
              </div>
              <button
                onClick={() => navigate("/categories")}
                className="text-white underline text-sm font-medium hover:no-underline"
              >
                Browse →
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
