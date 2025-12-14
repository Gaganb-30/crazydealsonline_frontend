import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Search,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Star,
  Eye,
  Sparkles,
  TrendingUp,
  BookOpen,
  Clock,
  Award,
  Filter,
  ChevronDown,
  Zap,
} from "lucide-react";

const HomePage = () => {
  const [booksByCategory, setBooksByCategory] = useState({});
  const [latestBooks, setLatestBooks] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [hindiBooks, setHindiBooks] = useState([]);
  const [englishBooks, setEnglishBooks] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentFeaturedBook, setCurrentFeaturedBook] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();
  const booksRef = useRef(null);

  // Categories with better styling
  const categories = [
    { name: "All", color: "bg-blue-100 text-blue-800", icon: "📚" },
    { name: "Biography", color: "bg-purple-100 text-purple-800", icon: "👤" },
    { name: "Military", color: "bg-green-100 text-green-800", icon: "🛡️" },
    { name: "History", color: "bg-yellow-100 text-yellow-800", icon: "📜" },
    { name: "Self-help", color: "bg-pink-100 text-pink-800", icon: "💪" },
    { name: "Religious", color: "bg-indigo-100 text-indigo-800", icon: "🙏" },
    { name: "Hindi", color: "bg-orange-100 text-orange-800", icon: "🇮🇳" },
    { name: "English", color: "bg-red-100 text-red-800", icon: "🇺🇸" },
  ];

  // Top stats
  const stats = [
    { label: "Books", value: "10K+", sub: "Available" },
    { label: "Readers", value: "50K+", sub: "Active" },
    { label: "Ratings", value: "4.8★", sub: "Avg Rating" },
    { label: "Delivered", value: "25K+", sub: "Orders" },
  ];

  // Fetch all books data
  const fetchAllBooks = async () => {
    try {
      setLoading(true);

      // Fetch latest books
      const latestRes = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/books?page=1&limit=12&sort=createdAt&order=desc`
      );
      const latestData = await latestRes.json();
      if (latestData.success) {
        setLatestBooks(latestData.data.books || []);
      }

      // Fetch featured books
      const featuredRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/books/featured/books?limit=6`
      );
      const featuredData = await featuredRes.json();
      if (featuredData.success) {
        setFeaturedBooks(featuredData.data.books || []);
      }

      // Fetch trending books
      const trendingRes = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/books?page=1&limit=8&sort=views&order=desc`
      );
      const trendingData = await trendingRes.json();
      if (trendingData.success) {
        setTrendingBooks(trendingData.data.books || []);
      }

      // Fetch Hindi books (assuming language filter)
      const hindiRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/books?language=Hindi&limit=8`
      );
      const hindiData = await hindiRes.json();
      if (hindiData.success) {
        setHindiBooks(hindiData.data.books || []);
      }

      // Fetch English books
      const englishRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/books?language=English&limit=8`
      );
      const englishData = await englishRes.json();
      if (englishData.success) {
        setEnglishBooks(englishData.data.books || []);
      }

      // Fetch books by category
      const categoryPromises = categories.map(async (cat) => {
        if (
          cat.name !== "All" &&
          cat.name !== "Hindi" &&
          cat.name !== "English"
        ) {
          try {
            const response = await fetch(
              `${import.meta.env.VITE_API_URL}/api/books/category/${
                cat.name
              }?page=1&limit=4`
            );
            const data = await response.json();
            if (data.success) {
              return { [cat.name]: data.data };
            }
          } catch (err) {
            console.error(`Error fetching ${cat.name} books:`, err);
          }
        }
        return null;
      });

      const categoryResults = await Promise.all(categoryPromises);
      const categoryBooks = {};
      categoryResults.forEach((result) => {
        if (result) {
          Object.assign(categoryBooks, result);
        }
      });
      setBooksByCategory(categoryBooks);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBooks();
  }, []);

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

  // Scroll to books section
  const scrollToBooks = () => {
    booksRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Get book image URL
  const getBookImageUrl = (book) => {
    return (
      book.images?.find((img) => img.isPrimary)?.url ||
      book.images?.[0]?.url ||
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&auto=format&fit=crop"
    );
  };

  // Get books based on active category
  const getFilteredBooks = () => {
    switch (activeCategory) {
      case "Hindi":
        return hindiBooks;
      case "English":
        return englishBooks;
      case "All":
        return latestBooks;
      default:
        return booksByCategory[activeCategory]?.books || [];
    }
  };

  // Loading state
  if (loading && !latestBooks.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading amazing books...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with Books Immediately Visible */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50"></div>

        <div className="container mx-auto px-4 py-6 md:py-8 relative z-10">
          {/* Header with Stats */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="mb-6 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Discover Your Next{" "}
                <span className="text-blue-600">Favorite Read</span>
              </h1>
              <p className="text-gray-600 mt-2">
                Curated collection of amazing books
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-8" ref={booksRef}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Filter className="mr-2" size={20} />
                Browse Categories
              </h2>
              <button
                onClick={scrollToBooks}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                View All <ChevronDown className="ml-1" size={16} />
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeCategory === cat.name
                      ? `${cat.color} shadow-md scale-105`
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Books Grid - Immediately Visible */}
      <div className="container mx-auto px-4 pb-8">
        {/* Books Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {activeCategory === "All"
                ? "Latest Books"
                : `${activeCategory} Books`}
            </h2>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {getFilteredBooks()
            .slice(0, 12)
            .map((book) => (
              <div
                key={book._id}
                className="group bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden cursor-pointer"
                onClick={() => navigate(`/products/${book._id}`)}
              >
                {/* Book Cover */}
                <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                  <img
                    src={getBookImageUrl(book)}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Quick Actions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/products/${book._id}`);
                        }}
                        className="bg-white text-gray-800 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-gray-100 transition-colors"
                      >
                        Quick View
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/products/${book._id}`);
                        }}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-blue-700 transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>

                  {/* Badge */}
                  {book.discount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      -{book.discount}%
                    </div>
                  )}
                </div>

                {/* Book Info */}
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 leading-tight">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 text-xs mb-2 line-clamp-1">
                    {book.author}
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold text-gray-900">
                        ₹{book.price}
                      </span>
                      {book.originalPrice &&
                        book.originalPrice > book.price && (
                          <span className="text-xs text-gray-500 line-through ml-2">
                            ₹{book.originalPrice}
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Load More Button */}
        {getFilteredBooks().length > 12 && (
          <div className="text-center mt-8">
            <button className="border-2 border-blue-600 text-blue-600 px-8 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Load More Books
            </button>
          </div>
        )}
      </div>

      {/* Featured Books Slider */}
      {featuredBooks.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="text-blue-600" size={20} />
                  <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">
                    Featured
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Editor's Choice
                </h2>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {featuredBooks[currentFeaturedBook] && (
                  <div className="flex flex-col md:flex-row">
                    {/* Book Image */}
                    <div className="md:w-2/5 bg-gradient-to-br from-blue-100 to-indigo-100 p-8 flex items-center justify-center">
                      <div className="w-48 h-64 md:w-56 md:h-72 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
                        <img
                          src={getBookImageUrl(
                            featuredBooks[currentFeaturedBook]
                          )}
                          alt={featuredBooks[currentFeaturedBook].title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Book Details */}
                    <div className="md:w-3/5 p-8">
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {featuredBooks[currentFeaturedBook].category ||
                            "Featured"}
                        </span>
                        <span className="flex items-center text-sm text-gray-600">
                          <Clock className="mr-1" size={14} />
                          320 pages
                        </span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                        {featuredBooks[currentFeaturedBook].title}
                      </h3>

                      <p className="text-gray-600 mb-6 line-clamp-3">
                        {featuredBooks[currentFeaturedBook].about ||
                          "An extraordinary book that has captured the hearts of readers worldwide."}
                      </p>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-3xl font-bold text-gray-900">
                            ₹{featuredBooks[currentFeaturedBook].price}
                          </div>
                          {featuredBooks[currentFeaturedBook].originalPrice && (
                            <div className="text-sm text-gray-500 line-through">
                              ₹
                              {featuredBooks[currentFeaturedBook].originalPrice}
                            </div>
                          )}
                        </div>

                        <div className="flex space-x-3">
                          <button
                            onClick={() =>
                              navigate(
                                `/products/${featuredBooks[currentFeaturedBook]._id}`
                              )
                            }
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                          >
                            View Details
                          </button>
                          <button className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              {featuredBooks.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentFeaturedBook((prev) =>
                        prev > 0 ? prev - 1 : featuredBooks.length - 1
                      )
                    }
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentFeaturedBook((prev) =>
                        prev < featuredBooks.length - 1 ? prev + 1 : 0
                      )
                    }
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>

                  {/* Indicators */}
                  <div className="flex justify-center mt-6 space-x-2">
                    {featuredBooks.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          currentFeaturedBook === index
                            ? "bg-blue-600 w-6"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                        onClick={() => setCurrentFeaturedBook(index)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Trending Books */}
      {trendingBooks.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="text-orange-600" size={20} />
                <span className="text-sm font-medium text-orange-600 uppercase tracking-wider">
                  Trending Now
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Most Popular This Week
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingBooks.slice(0, 4).map((book, index) => (
              <div
                key={book._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={getBookImageUrl(book)}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -top-2 -left-2 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        #{index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 text-xs mb-3">
                        {book.author}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{book.price}
                        </span>
                        <button
                          onClick={() => navigate(`/products/${book._id}`)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Categories Grid */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Explore by Genre
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.slice(1, 7).map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                setActiveCategory(cat.name);
                scrollToBooks();
              }}
              className={`${cat.color} rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="text-2xl mb-2">{cat.icon}</div>
              <div className="font-medium text-sm">{cat.name}</div>
              <div className="text-xs text-gray-600 mt-1">
                {booksByCategory[cat.name]?.pagination?.totalBooks || "100+"}{" "}
                books
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Reading?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our community of readers and discover amazing books every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/categories")}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Browse All Books
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
