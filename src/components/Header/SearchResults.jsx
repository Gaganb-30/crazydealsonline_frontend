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
  FileText,
  User,
  Hash,
  X,
} from "lucide-react";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [searchType, setSearchType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [formatFilter, setFormatFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("q") || "";
  const urlSearchType = searchParams.get("type") || "all";
  const itemsPerPage = 48;

  useEffect(() => {
    // Set search type from URL parameter
    if (
      urlSearchType &&
      ["all", "title", "author", "isbn"].includes(urlSearchType)
    ) {
      setSearchType(urlSearchType);
    }
  }, [urlSearchType]);

  // Fetch search results
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) return;

      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/api/books/search?q=${encodeURIComponent(searchQuery)}&limit=1000`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }

        const data = await response.json();

        if (data.success) {
          const allBooks = data.data.books || [];
          setBooks(allBooks);
          setFilteredBooks(allBooks);
          setTotalPages(Math.ceil(allBooks.length / itemsPerPage));

          // Set max price from fetched books
          if (allBooks.length > 0) {
            const maxBookPrice = Math.max(
              ...allBooks.map((book) => book.price || 0)
            );
            setPriceRange([0, Math.min(99999999, maxBookPrice)]);
          }
        } else {
          throw new Error(data.message || "Search failed");
        }
      } catch (err) {
        console.error("Search results error:", err);
        setError(err.message);
        setBooks([]);
        setFilteredBooks([]);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery.trim()) {
      fetchSearchResults();
    }
  }, [searchQuery]);

  // Apply filters and sorting on frontend
  useEffect(() => {
    if (books.length === 0) return;

    let result = [...books];

    // Apply search type filtering
    if (searchType !== "all") {
      const searchTerm = searchQuery.toLowerCase();
      result = result.filter((book) => {
        switch (searchType) {
          case "title":
            return book.title?.toLowerCase().includes(searchTerm);
          case "author":
            return book.author?.toLowerCase().includes(searchTerm);
          case "isbn":
            return book.details?.isbn?.toLowerCase().includes(searchTerm);
          default:
            return true;
        }
      });
    }

    // Apply price filter
    result = result.filter((book) => {
      const price = book.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Apply format filter
    if (formatFilter !== "all") {
      result = result.filter((book) => book.format === formatFilter);
    }

    // Apply availability filter
    // if (availabilityFilter !== "all") {
    //   if (availabilityFilter === "in-stock") {
    //     result = result.filter((book) => book.stock > 0);
    //   } else if (availabilityFilter === "out-of-stock") {
    //     result = result.filter((book) => book.stock <= 0);
    //   }
    // }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "rating":
          return (b.ratings?.average || 0) - (a.ratings?.average || 0);
        default: {
          // Simple relevance scoring based on search type
          let scoreA = 0;
          let scoreB = 0;
          const searchTerm = searchQuery.toLowerCase();

          if (a.title?.toLowerCase().includes(searchTerm)) scoreA += 3;
          if (a.author?.toLowerCase().includes(searchTerm)) scoreA += 2;
          if (a.details?.isbn?.toLowerCase().includes(searchTerm)) scoreA += 1;

          if (b.title?.toLowerCase().includes(searchTerm)) scoreB += 3;
          if (b.author?.toLowerCase().includes(searchTerm)) scoreB += 2;
          if (b.details?.isbn?.toLowerCase().includes(searchTerm)) scoreB += 1;

          return scoreB - scoreA;
        }
      }
    });

    setFilteredBooks(result);
    setTotalPages(Math.ceil(result.length / itemsPerPage));
    setCurrentPage(1);
  }, [
    books,
    searchType,
    searchQuery,
    priceRange,
    formatFilter,
    availabilityFilter,
    sortBy,
  ]);

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    navigate(`/search?q=${encodeURIComponent(searchQuery)}&type=${type}`, {
      replace: true,
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handlePriceRangeChange = (min, max) => {
    setPriceRange([min, max]);
  };

  const handleMinPriceChange = (e) => {
    const minValue = parseInt(e.target.value) || 0;
    setPriceRange([minValue, priceRange[1]]);
  };

  const handleMaxPriceChange = (e) => {
    const maxValue = parseInt(e.target.value) || 0;
    setPriceRange([priceRange[0], maxValue]);
  };

  const clearAllFilters = () => {
    const maxPrice =
      books.length > 0
        ? Math.max(...books.map((book) => book.price || 0))
        : 5000;
    setPriceRange([0, Math.max(5000, maxPrice)]);
    setFormatFilter("all");
    setAvailabilityFilter("all");
    setSortBy("relevance");
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    const maxPrice =
      books.length > 0
        ? Math.max(...books.map((book) => book.price || 0))
        : 5000;
    if (priceRange[0] > 0 || priceRange[1] < Math.max(5000, maxPrice)) count++;
    if (formatFilter !== "all") count++;
    if (availabilityFilter !== "all") count++;
    if (sortBy !== "relevance") count++;
    return count;
  };

  const getSearchTypeLabel = (type) => {
    switch (type) {
      case "title":
        return "Title";
      case "author":
        return "Author";
      case "isbn":
        return "ISBN";
      default:
        return "All Fields";
    }
  };

  const getSearchTypeIcon = (type) => {
    switch (type) {
      case "title":
        return <FileText className="h-4 w-4" />;
      case "author":
        return <User className="h-4 w-4" />;
      case "isbn":
        return <Hash className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
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

          {searchType === "isbn" && book.details?.isbn && (
            <p className="text-xs text-gray-500 mb-2">
              ISBN: {book.details.isbn}
            </p>
          )}

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

            {searchType === "isbn" && book.details?.isbn && (
              <p className="text-sm text-gray-500 mb-2">
                <strong>ISBN:</strong> {book.details.isbn}
              </p>
            )}

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

  // Filter Sidebar Component
  const FilterSidebar = () => {
    const maxPrice =
      books.length > 0
        ? Math.min(...books.map((book) => book.price || 0))
        : 99999999;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {getActiveFiltersCount() > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-500">Min Price</label>
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange[0]}
                onChange={handleMinPriceChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-500">Max Price</label>
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange[1]}
                onChange={handleMaxPriceChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
            </div>

            <div className="flex gap-2">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) =>
                  handlePriceRangeChange(
                    parseInt(e.target.value) || 0,
                    priceRange[1]
                  )
                }
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                placeholder="Min"
                min="0"
                max={priceRange[1]}
              />
              <span className="self-center text-gray-500">-</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) =>
                  handlePriceRangeChange(
                    priceRange[0],
                    parseInt(e.target.value) || maxPrice
                  )
                }
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                placeholder="Max"
                min={priceRange[0]}
                max={maxPrice}
              />
            </div>
          </div>
        </div>

        {/* Format Filter */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Format</h4>
          <div className="space-y-2">
            {["all", "Paperback", "Hardcover"].map((format) => (
              <label key={format} className="flex items-center">
                <input
                  type="radio"
                  name="format"
                  value={format}
                  checked={formatFilter === format}
                  onChange={(e) => setFormatFilter(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">
                  {format === "all" ? "All Formats" : format}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Availability Filter */}
        {/* <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Availability</h4>
          <div className="space-y-2">
            {["all", "in-stock", "out-of-stock"].map((availability) => (
              <label key={availability} className="flex items-center">
                <input
                  type="radio"
                  name="availability"
                  value={availability}
                  checked={availabilityFilter === availability}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">
                  {availability === "all"
                    ? "All Books"
                    : availability === "in-stock"
                    ? "In Stock"
                    : "Out of Stock"}
                </span>
              </label>
            ))}
          </div>
        </div> */}
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
              onClick={() => window.location.reload()}
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Search Results for "{searchQuery}"
              </h1>
              <p className="text-gray-600 mt-2">
                Found {filteredBooks.length} book
                {filteredBooks.length !== 1 ? "s" : ""}
                {filteredBooks.length > 0 &&
                  ` • Page ${currentPage} of ${totalPages}`}
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
                <option value="price-low">Sort by Price: Low to High</option>
                <option value="price-high">Sort by Price: High to Low</option>
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

          {/* Search Type Options */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Search by:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              {[
                {
                  type: "all",
                  label: "All Fields",
                  description: "Search in all fields",
                },
                {
                  type: "title",
                  label: "Title",
                  description: "Search by book title",
                },
                {
                  type: "author",
                  label: "Author",
                  description: "Search by author name",
                },
                {
                  type: "isbn",
                  label: "ISBN",
                  description: "Search by ISBN number",
                },
              ].map((option) => (
                <button
                  key={option.type}
                  onClick={() => handleSearchTypeChange(option.type)}
                  className={`flex items-start p-3 rounded-lg border-2 transition-all duration-200 ${
                    searchType === option.type
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`p-2 rounded-full mr-3 ${
                        searchType === option.type
                          ? "bg-blue-100"
                          : "bg-gray-100"
                      }`}
                    >
                      {getSearchTypeIcon(option.type)}
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="sticky top-32">
              <FilterSidebar />
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" />
                <span>Filter</span>
                {getActiveFiltersCount() > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Filters Overlay */}
            {showFilters && (
              <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
                <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-lg overflow-y-auto">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Filters</h3>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <FilterSidebar />
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            {filteredBooks.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No books found
                </h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any books matching "{searchQuery}" in{" "}
                  {getSearchTypeLabel(searchType).toLowerCase()}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => handleSearchTypeChange("all")}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Try searching in all fields
                  </button>
                  <span className="hidden sm:block text-gray-400">•</span>
                  <Link
                    to="/categories"
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
                      ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : "space-y-6"
                  }
                >
                  {filteredBooks
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage
                    )
                    .map((book) =>
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
      </div>
    </div>
  );
};

export default SearchResults;
