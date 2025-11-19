import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Grid,
  List,
  Home,
  Filter,
} from "lucide-react";

const BookCategory = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState("relevance"); // 'relevance', 'title', 'price', 'rating'
  const navigate = useNavigate();

  const pathParts = window.location.pathname.split("/");
  const lastPart = pathParts[pathParts.length - 1];
  const categoryName = lastPart.charAt(0).toUpperCase() + lastPart.slice(1);

  // Fetch books for category
  useEffect(() => {
    const fetchCategoryBooks = async () => {
      try {
        setLoading(true);

        let sortField = "createdAt";
        let sortOrder = "desc";

        switch (sortBy) {
          case "title":
            sortField = "title";
            sortOrder = "asc";
            break;
          case "price":
            sortField = "price";
            sortOrder = "asc";
            break;
          case "relevance":
          default:
            sortField = "createdAt";
            sortOrder = "desc";
        }

        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/api/books/category/${lastPart}?page=${currentPage}&limit=48&sort=${sortField}&order=${sortOrder}`
        );
        const data = await response.json();

        if (data.success) {
          setBooks(data.data.books);
          setTotalPages(data.data.pagination.totalPages);
          setTotalBooks(
            data.data.pagination.totalBooks || data.data.books.length
          );
        } else {
          setError(`Failed to load ${categoryName.toLowerCase()} books`);
        }
      } catch (err) {
        setError(`Failed to load ${categoryName.toLowerCase()} books`);
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryBooks();
  }, [currentPage, sortBy, lastPart, categoryName]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  // Book Card Component - Using the design from SearchResults
  const BookCard = ({ book }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link to={`/products/${book._id}`} className="block">
        <div className="aspect-[3/4] bg-gray-200 rounded-t-lg overflow-hidden">
          <img
            src={
              book.images.find((img) => img.isPrimary)?.url ||
              book.images[0]?.url
            }
            alt={book.images.find((img) => img.isPrimary)?.alt || book.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = "/book-placeholder.png";
            }}
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 hover:text-blue-600 transition-colors">
            {book.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">by {book.author}</p>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-blue-600">
                ₹{book.price}
              </span>
              {book.originalPrice && book.originalPrice > book.price && (
                <span className="ml-2 text-sm text-gray-500 line-through">
                  ₹{book.originalPrice}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded">
              {book.format}
            </span>
          </div>

          {book.stock <= 0 && (
            <div className="mt-2 text-xs text-red-600 font-medium">
              Out of Stock
            </div>
          )}
        </div>
      </Link>
    </div>
  );

  // List View Component
  const BookListItem = ({ book }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link to={`/products/${book._id}`} className="block">
        <div className="flex p-4">
          <div className="w-24 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={
                book.images.find((img) => img.isPrimary)?.url ||
                book.images[0]?.url
              }
              alt={book.images.find((img) => img.isPrimary)?.alt || book.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/book-placeholder.png";
              }}
            />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors">
              {book.title}
            </h3>
            <p className="text-gray-600 mb-2">by {book.author}</p>

            <div className="flex items-center mb-2">
              <span className="text-sm text-gray-500 capitalize mr-3">
                {book.format}
              </span>
              <span className="text-sm text-gray-500 mr-3">
                {book.category}
              </span>
              {/* book.ratings && (
                <div className="flex items-center">
                  {renderStars(book.ratings.average || 0)}
                </div>
              ) */}
            </div>

            <p className="text-gray-700 text-sm line-clamp-2 mb-3">
              {book.about || "No description available."}
            </p>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xl font-bold text-blue-600">
                  ₹{book.price}
                </span>
                {book.originalPrice && book.originalPrice > book.price && (
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    ₹{book.originalPrice}
                  </span>
                )}
              </div>
              {book.stock <= 0 && (
                <span className="text-sm text-red-600 font-medium">
                  Out of Stock
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            currentPage === i
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
          </>
        )}

        {pages}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-2 text-gray-500">...</span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              Loading {categoryName.toLowerCase()} books...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">
            <p className="text-xl mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              {/* Breadcrumb */}
              <nav className="flex mb-4" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  <li>
                    <button
                      onClick={() => navigate("/")}
                      className="text-gray-500 hover:text-gray-700 flex items-center"
                    >
                      <Home className="h-4 w-4" />
                    </button>
                  </li>
                  <li>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </li>
                  <li>
                    <span className="text-gray-900 font-medium">
                      {categoryName} Books
                    </span>
                  </li>
                </ol>
              </nav>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {categoryName} Books
              </h1>
              <p className="text-gray-600 text-lg max-w-3xl">
                Discover our curated collection of {categoryName.toLowerCase()}{" "}
                books - from beginner guides to advanced topics and everything
                in between.
              </p>
            </div>

            {/* Results Count */}
            <div className="mt-4 lg:mt-0 lg:ml-8">
              <div className="bg-blue-50 rounded-lg px-4 py-3">
                <p className="text-blue-800 font-semibold">
                  {totalBooks} {categoryName.toLowerCase()} book
                  {totalBooks !== 1 ? "s" : ""} available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              {/* Sort By */}
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="relevance">Sort by Relevance</option>
                <option value="title">Sort by Title</option>
                <option value="price">Sort by Price</option>
                <option value="rating">Sort by Rating</option>
              </select>

              {/* Filter Button */}
              <button className="flex items-center space-x-2 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Books Grid/List */}
        {books.length > 0 ? (
          <>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
                  : "space-y-6"
              }
            >
              {books.map((book) =>
                viewMode === "grid" ? (
                  <BookCard key={book._id} book={book} />
                ) : (
                  <BookListItem key={book._id} book={book} />
                )
              )}
            </div>

            {/* Pagination */}
            {renderPagination()}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No {categoryName} Books Found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We're currently updating our {categoryName.toLowerCase()}{" "}
              collection. Please check back later or browse other categories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Browse All Categories
              </button>
              <button
                onClick={() => window.location.reload()}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )}

        {/* Newsletter Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Love {categoryName} Books?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new{" "}
            {categoryName.toLowerCase()}
            releases, exclusive deals, and author events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap">
              Subscribe Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCategory;
