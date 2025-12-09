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
} from "lucide-react";

const HomePage = () => {
  const [booksByCategory, setBooksByCategory] = useState({});
  const [latestBooks, setLatestBooks] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booksLoading, setBooksLoading] = useState(true);
  const [featuredBooksLoading, setFeaturedBooksLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentFeaturedBook, setCurrentFeaturedBook] = useState(0);
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
      name: "Fiction",
      route: "/collections/fiction",
      image: "https://i.postimg.cc/HLvRsJ6m/Fiction.png",
      color: "bg-purple-200",
    },
    {
      name: "Science",
      route: "/collections/science",
      image:
        "https://i.postimg.cc/85F3F109/groovy-back-to-school-clipart-science-book-illustration-in-trendy-retro-y2k-style-png.png",
      color: "bg-blue-200",
    },
    {
      name: "History",
      route: "/collections/history",
      image: "https://i.postimg.cc/nzs5sHP6/history.png",
      color: "bg-yellow-100",
    },
    {
      name: "Mystery",
      route: "/collections/mystery",
      image:
        "https://i.postimg.cc/PxLcLtR0/pngtree-ancient-vintage-mystery-book-with-ornate-details-png-image-14657244.png",
      color: "bg-pink-200",
    },
    {
      name: "Romance",
      route: "/collections/romance",
      image: "https://i.postimg.cc/9M4S4Wk0/romance.png",
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
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 3);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 3) % 3);
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
    const startIndex = currentSlide * 6;
    const endIndex = startIndex + 6;
    return latestBooks.slice(startIndex, endIndex);
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
    <div className="w-full bg-cream overflow-x-hidden">
      {/* Hero Section - UPDATED */}
      <section className="flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-8 bg-gray-300">
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
          <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-3xl p-6 sm:p-8 relative z-10 min-h-64 sm:min-h-80 md:min-h-96 flex items-center justify-center">
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
                      : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentFeaturedBook(index)}
                />
              ))}
            </div>
          )}
        </div>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className={`${cat.color} rounded-2xl p-4 sm:p-6 text-center cursor-pointer hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center min-h-32`}
              onClick={() => navigate(cat.route)}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain mb-2"
              />
              <p className="text-sm font-medium text-gray-800">{cat.name}</p>
              <p className="text-gray-500 text-xs mt-1">
                {booksByCategory[cat.name]?.pagination.totalBooks || 0} books
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Books Slider */}
      <section className="px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-navy">Latest Books</h2>
          <div className="flex gap-3">
            <button
              className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
              onClick={prevSlide}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
              onClick={nextSlide}
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {getCurrentSlideBooks().map((book) => (
                <div
                  key={book._id}
                  className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer flex flex-col h-full"
                  onClick={() => navigate(`/products/${book._id}`)}
                >
                  <div className="relative aspect-[3/4] bg-gray-100 flex items-center justify-center p-4">
                    <img
                      src={getBookImageUrl(book)}
                      alt={book.title}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-2 right-2 bg-navy text-white bg-gradient-to-r from-blue-500 to-indigo-600 px-3 py-1 rounded-full text-xs font-semibold">
                      {book.format || "Paperback"}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">
                      {book.title}
                    </h3>
                    <p className="text-gray-600 text-xs mb-3 line-clamp-1">
                      {book.author}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{book.price}
                      </span>
                      {book.originalPrice &&
                        book.originalPrice > book.price && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{book.originalPrice}
                          </span>
                        )}
                    </div>

                    <div className="mt-auto space-y-2">
                      <button
                        className="w-full border border-gray-300 text-gray-700 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/products/${book._id}`);
                        }}
                      >
                        <Eye size={14} />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentSlide === index ? "bg-navy" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentSlide(index)}
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

      {/* Promo Boxes - UPDATED with background images */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* New Publications */}
          <div
            className="relative rounded-2xl p-6 sm:p-8 text-white overflow-hidden min-h-48 flex flex-col justify-between"
            style={{
              backgroundImage: `url('${promoBackgrounds.newPublications}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-teal-600 bg-opacity-40"></div>
            <div className="relative z-10">
              <h3 className="text-lg sm:text-xl font-bold mb-2">
                New Publications
              </h3>
              <p className="text-sm mb-4">Discover the latest releases</p>
              <button
                onClick={() => navigate("/categories")}
                className="text-white underline text-sm font-medium hover:no-underline"
              >
                Show more →
              </button>
            </div>
          </div>

          {/* Sale on History books */}
          <div
            className="relative rounded-2xl p-6 sm:p-8 text-white overflow-hidden min-h-48 flex flex-col justify-between"
            style={{
              backgroundImage: `url('${promoBackgrounds.historySale}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-blue-900 bg-opacity-40"></div>
            <div className="relative z-10">
              <h3 className="text-lg sm:text-xl font-bold mb-2">
                Sale on History books
              </h3>
              <p className="text-sm mb-4">Enjoy special discounts</p>
              <button
                onClick={() => navigate("/collections/history")}
                className="text-white underline text-sm font-medium hover:no-underline"
              >
                Shop now →
              </button>
            </div>
          </div>

          {/* Top Rated */}
          <div
            className="relative rounded-2xl p-6 sm:p-8 text-white overflow-hidden min-h-48 flex flex-col justify-between"
            style={{
              backgroundImage: `url('${promoBackgrounds.topRated}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-red-400 bg-opacity-40"></div>
            <div className="relative z-10">
              <h3 className="text-lg sm:text-xl font-bold mb-2">Top Rated</h3>
              <p className="text-sm mb-4">Best sellers this week</p>
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
    </div>
  );
};

export default HomePage;
