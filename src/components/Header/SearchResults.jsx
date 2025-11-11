import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Search,
  Filter,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Star,
  BookOpen,
} from "lucide-react";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState("relevance"); // 'relevance', 'title', 'price', 'rating'

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("q") || "";
  const itemsPerPage = 48;

  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults();
    }
  }, [searchQuery, currentPage, sortBy]);

  useEffect(() => {
    // Reset to page 1 when search query changes
    setCurrentPage(1);
  }, [searchQuery]);

  const fetchSearchResults = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError("");

    try {
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
        case "rating":
          sortField = "ratings.average";
          sortOrder = "desc";
          break;
        case "relevance":
        default:
          // For relevance, we'll use the default sort from the API
          sortField = "createdAt";
          sortOrder = "desc";
      }

      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/books/search?q=${encodeURIComponent(
          searchQuery
        )}&page=${currentPage}&limit=${itemsPerPage}&sort=${sortField}&order=${sortOrder}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      const data = await response.json();

      if (data.success) {
        setBooks(data.data.books || []);
        setTotalPages(data.data.pagination?.totalPages || 1);
        setTotalBooks(data.data.pagination?.totalBooks || 0);
      } else {
        throw new Error(data.message || "Search failed");
      }
    } catch (err) {
      console.error("Search results error:", err);
      setError(err.message);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Scroll to top when page changes
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

  const renderBookCard = (book) => (
    <div
      key={book._id || book.id}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <Link to={`/products/${book._id || book.id}`} className="block">
        <div className="aspect-[3/4] bg-gray-200 rounded-t-lg overflow-hidden">
          <img
            src={book.images?.[0]?.url || "/book-placeholder.png"}
            alt={book.title}
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

          {book.ratings && (
            <div className="flex items-center mb-2">
              {renderStars(book.ratings.average || 0)}
              <span className="text-xs text-gray-500 ml-1">
                ({book.ratings.count || 0})
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-blue-600">
                ${book.price}
              </span>
              {book.originalPrice && book.originalPrice > book.price && (
                <span className="ml-2 text-sm text-gray-500 line-through">
                  ${book.originalPrice}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded">
              {book.format}
            </span>
          </div>

          {book.available === false && (
            <div className="mt-2 text-xs text-red-600 font-medium">
              Out of Stock
            </div>
          )}
        </div>
      </Link>
    </div>
  );

  const renderBookListItem = (book) => (
    <div
      key={book._id || book.id}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <Link to={`/products/${book._id || book.id}`} className="block">
        <div className="flex p-4">
          <div className="w-24 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={book.images?.[0]?.url || "/book-placeholder.png"}
              alt={book.title}
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
              {book.ratings && (
                <div className="flex items-center">
                  {renderStars(book.ratings.average || 0)}
                </div>
              )}
            </div>

            <p className="text-gray-700 text-sm line-clamp-2 mb-3">
              {book.about || "No description available."}
            </p>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xl font-bold text-blue-600">
                  ${book.price}
                </span>
                {book.originalPrice && book.originalPrice > book.price && (
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    ${book.originalPrice}
                  </span>
                )}
              </div>
              {book.available === false && (
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

  if (loading && books.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              Searching for "{searchQuery}"...
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
            <p>Error: {error}</p>
            <button
              onClick={fetchSearchResults}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Search Results for "{searchQuery}"
              </h1>
              <p className="text-gray-600 mt-2">
                Found {totalBooks} book{totalBooks !== 1 ? "s" : ""}
                {totalBooks > 0 && ` • Page ${currentPage} of ${totalPages}`}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* Sort By */}
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="relevance">Sort by Relevance</option>
                <option value="title">Sort by Title</option>
                <option value="price">Sort by Price</option>
                <option value="rating">Sort by Rating</option>
              </select>

              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {books.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No books found
            </h3>
            <p className="text-gray-600">
              We couldn't find any books matching "{searchQuery}"
            </p>
            <div className="mt-4">
              <Link
                to="/books"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Browse all books
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Books Grid/List */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
                  : "space-y-6"
              }
            >
              {books.map((book) =>
                viewMode === "grid"
                  ? renderBookCard(book)
                  : renderBookListItem(book)
              )}
            </div>

            {/* Pagination */}
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
