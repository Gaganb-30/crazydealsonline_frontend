import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  ShoppingCart,
  User,
  X,
  Menu,
  BookOpen,
  Users,
  Mail,
  Home,
  Book,
  UserPen,
  Building,
} from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchError, setSearchError] = useState("");
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  const navigate = useNavigate();
  // Debounced search function
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setSearchError("");
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchActive(false);
        setSearchQuery("");
        setSearchResults([]);
        setSearchError("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const performSearch = async (query) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setSearchError("");

    try {
      const response = await fetch(
        `${process.env.VITE_API_URL}/api/books/search?q=${encodeURIComponent(
          query
        )}&limit=5`
      );

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(
          "Server returned non-JSON response. Please check the API endpoint."
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      if (data.success) {
        setSearchResults(data.data.books || []);
      } else {
        throw new Error(data.message || "Search failed");
      }
    } catch (error) {
      setSearchError(error.message);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchToggle = () => {
    setIsSearchActive(!isSearchActive);
    if (!isSearchActive) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery("");
      setSearchResults([]);
      setSearchError("");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const navigationItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Books", href: "/categories", icon: Book },
    // { name: 'Writers', href: '/writers', icon: UserPen },
    { name: "Policy", href: "/privacy-policy", icon: Building },
    { name: "About Us", href: "/about-us", icon: Users },
    { name: "Contact Us", href: "/contact-us", icon: Mail },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  BookStore
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation - Hidden when search is active */}
          {!isSearchActive && (
            <nav className="hidden md:flex items-center space-x-8 ml-24">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {item.name}
                  </a>
                );
              })}
            </nav>
          )}

          {/* Search Bar - Expands when active */}
          <div
            ref={searchRef}
            className="flex items-center space-x-4 flex-1 justify-end"
          >
            {/* Search Container */}
            <div
              className={`relative ${
                isSearchActive ? "flex-1 max-w-2xl" : "w-auto"
              }`}
            >
              <form onSubmit={handleSearchSubmit} className="relative">
                <div
                  className={`relative transition-all duration-300 ${
                    isSearchActive ? "w-full" : "w-10"
                  }`}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search books, authors..."
                    className={`w-full py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                      isSearchActive ? "opacity-100" : "opacity-0 w-0"
                    }`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={handleSearchToggle}
                    className={`absolute inset-y-0 left-0 flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 ${
                      isSearchActive
                        ? "text-gray-500 hover:text-gray-700"
                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                    }`}
                  >
                    {isSearchActive ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <Search className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </form>

              {/* Live Search Results Dropdown */}
              {isSearchActive && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50 animate-slideIn">
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2">Searching...</p>
                    </div>
                  ) : searchError ? (
                    <div className="p-4 text-center text-red-500">
                      <p className="text-sm">Search error: {searchError}</p>
                      <button
                        onClick={() => performSearch(searchQuery)}
                        className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Try again
                      </button>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((book) => (
                        <a
                          key={book._id || book.id}
                          href={`/products/${book._id || book.id}`}
                          className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                        >
                          <img
                            src={
                              book.images?.[0]?.url || "/book-placeholder.png"
                            }
                            alt={book.title}
                            className="w-10 h-14 object-cover rounded mr-3"
                            onError={(e) => {
                              e.target.src = "/book-placeholder.png";
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {book.title}
                            </h4>
                            <p className="text-sm text-gray-600 truncate">
                              by {book.author}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-sm font-semibold text-blue-600">
                                ${book.price}
                              </span>
                              <span className="text-xs text-gray-500 capitalize">
                                {book.format}
                              </span>
                            </div>
                          </div>
                        </a>
                      ))}
                      <div className="px-4 py-3 border-t border-gray-200">
                        <a
                          href={`/search?q=${encodeURIComponent(searchQuery)}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium text-center block"
                        >
                          View all results
                        </a>
                      </div>
                    </div>
                  ) : searchQuery && !isLoading ? (
                    <div className="p-4 text-center text-gray-500">
                      <p>No books found for "{searchQuery}"</p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Other Icons - Hidden when search is active */}
            {!isSearchActive && (
              <>
                {/* Cart Icon */}
                <button
                  onClick={() => navigate("/viewcart")}
                  className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    0
                  </span>
                </button>

                {/* Login/User Icon */}
                <button
                  onClick={() => navigate("/profile")}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <User className="h-5 w-5" />
                </button>

                {/* Mobile menu button */}
                <button
                  className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <Menu className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="grid grid-cols-2 gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </a>
                );
              })}
            </nav>
          </div>
        )}
      </div>
      {/* Overlay for search results */}
      {isSearchActive && searchQuery && (
        <div
          className="fixed inset-0 bg-black bg-opacity-10 z-40 mt-16"
          onClick={() => {
            setIsSearchActive(false);
            setSearchQuery("");
            setSearchResults([]);
            setSearchError("");
          }}
        />
      )}
      // In your navigation component
      <Link to="/orders" className="text-gray-700 hover:text-blue-600">
        My Orders
      </Link>
    </header>
  );
};

export default Header;
