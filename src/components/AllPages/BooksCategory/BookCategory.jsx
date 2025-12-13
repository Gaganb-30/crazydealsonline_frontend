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
  X,
} from "lucide-react";

const BookCategory = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 99999999]);
  const [formatFilter, setFormatFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const navigate = useNavigate();

  const pathParts = window.location.pathname.split("/");
  const lastPart = pathParts[pathParts.length - 1];
  const categoryName = lastPart.charAt(0).toUpperCase() + lastPart.slice(1);

  // Fetch books for category
  useEffect(() => {
    const fetchCategoryBooks = async () => {
      try {
        setLoading(true);

        // First, get the total count of books
        const countResponse = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/api/books/category/${lastPart}?page=1&limit=1`
        );
        const countData = await countResponse.json();

        if (countData.success) {
          const totalBooksCount = countData.data.pagination.totalBooks || 0;
          setTotalBooks(totalBooksCount);

          // Calculate how many pages we need to fetch (48 books per page)
          const totalPagesNeeded = Math.ceil(totalBooksCount / 48);

          // Fetch all books by getting all pages
          let allBooks = [];
          for (let page = 1; page <= totalPagesNeeded; page++) {
            const response = await fetch(
              `${
                import.meta.env.VITE_API_URL
              }/api/books/category/${lastPart}?page=${page}&limit=48`
            );
            const data = await response.json();

            if (data.success) {
              allBooks = [...allBooks, ...(data.data.books || [])];
            }
          }

          setBooks(allBooks);
          setFilteredBooks(allBooks);
          setTotalPages(Math.ceil(allBooks.length / 48));

          // Set max price from fetched books
          if (allBooks.length > 0) {
            const maxBookPrice = Math.max(
              ...allBooks.map((book) => book.price || 0)
            );
            setPriceRange([0, Math.min(99999999, maxBookPrice)]);
          }
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
  }, [lastPart, categoryName]);

  // Apply filters and sorting whenever dependencies change
  useEffect(() => {
    if (books.length === 0) return;

    let result = [...books];

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
          return a.title.localeCompare(b.title);
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "relevance":
        default:
          return 0;
      }
    });

    setFilteredBooks(result);
    setTotalPages(Math.ceil(result.length / 48));
    setCurrentPage(1);
  }, [books, priceRange, formatFilter, availabilityFilter, sortBy]);

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
    setPriceRange([0, Math.min(99999999, maxPrice)]);
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
    if (priceRange[0] > 0 || priceRange[1] < Math.min(99999999, maxPrice))
      count++;
    if (formatFilter !== "all") count++;
    if (availabilityFilter !== "all") count++;
    if (sortBy !== "relevance") count++;
    return count;
  };

  // Book Card Component
  const BookCard = ({ book }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link to={`/products/${book._id}`} className="block">
        <div className="aspect-[3/4] bg-gray-200 rounded-t-lg overflow-hidden">
          <img
            src={
              book.images?.find((img) => img.isPrimary)?.url ||
              book.images?.[0]?.url ||
              "/book-placeholder.png"
            }
            alt={book.images?.find((img) => img.isPrimary)?.alt || book.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
                book.images?.find((img) => img.isPrimary)?.url ||
                book.images?.[0]?.url ||
                "/book-placeholder.png"
              }
              alt={book.images?.find((img) => img.isPrimary)?.alt || book.title}
              className="w-full h-full object-cover"
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
        ? Math.max(...books.map((book) => book.price || 0))
        : 5000;

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

        {/* Price Range Filter - IMPROVED with better slider handling */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>

            {/* Min Price Slider */}
            <div className="space-y-2">
              <label className="text-xs text-gray-500">Min Price</label>
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange[0]}
                onChange={handleMinPriceChange}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
            </div>

            {/* Max Price Slider */}
            <div className="space-y-2">
              <label className="text-xs text-gray-500">Max Price</label>
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange[1]}
                onChange={handleMaxPriceChange}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
            </div>

            {/* Number Inputs */}
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

        {/* Format Filter - Only Paperback and Hardcover */}
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
                  {getActiveFiltersCount() > 0
                    ? filteredBooks.length
                    : books.length}{" "}
                  {categoryName.toLowerCase()} book
                  {(getActiveFiltersCount() > 0
                    ? filteredBooks.length
                    : books.length) !== 1
                    ? "s"
                    : ""}{" "}
                  available
                  {getActiveFiltersCount() > 0 && " (filtered)"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - INCREASED STICKY DISTANCE */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="sticky top-32">
              {" "}
              {/* Increased from top-8 to top-32 */}
              <FilterSidebar />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center space-x-2 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                    {getActiveFiltersCount() > 0 && (
                      <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {getActiveFiltersCount()}
                      </span>
                    )}
                  </button>

                  {/* Sort By */}
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="relevance">Sort by Relevance</option>
                    <option value="title">Sort by Title (A-Z)</option>
                    <option value="price-low">
                      Sort by Price: Low to High
                    </option>
                    <option value="price-high">
                      Sort by Price: High to Low
                    </option>
                  </select>
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

            {/* Books Grid/List */}
            {filteredBooks.length > 0 ? (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : "space-y-6"
                  }
                >
                  {filteredBooks
                    .slice((currentPage - 1) * 48, currentPage * 48)
                    .map((book) =>
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
                  {getActiveFiltersCount() > 0
                    ? "No books match your current filters. Try adjusting your filters to see more results."
                    : `We're currently updating our ${categoryName.toLowerCase()} collection. Please check back later or browse other categories.`}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {getActiveFiltersCount() > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  )}
                  <button
                    onClick={() => navigate("/")}
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Browse All Categories
                  </button>
                </div>
              </div>
            )}

            {/* Newsletter Section */}
            {/* <div className="bg-white rounded-lg border border-gray-200 p-8 text-center mt-16">
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
            </div> */}
          </div>
        </div>
      </div>

      {/* Add CSS for better slider styling */}
      <style jsx>{`
        .slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          outline: none;
        }

        .slider-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }

        .slider-thumb::-webkit-slider-thumb:hover {
          background: #1d4ed8;
          transform: scale(1.1);
        }

        .slider-thumb::-webkit-slider-thumb:active {
          background: #1e40af;
          transform: scale(1.15);
        }

        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }

        .slider-thumb::-moz-range-thumb:hover {
          background: #1d4ed8;
          transform: scale(1.1);
        }

        .slider-thumb::-moz-range-track {
          width: 100%;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default BookCategory;
