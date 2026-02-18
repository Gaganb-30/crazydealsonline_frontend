import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { extractIdFromSlug, defaultSEO } from "../../../utils/seo";

const SingleBookPage = () => {
  const { slug } = useParams();
  const id = extractIdFromSlug(slug); // Extract actual ID from SEO-friendly slug
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // FIX: Scroll to top when component mounts or id changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Fetch single book by ID
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setBook(null); // Reset book data to prevent stale meta tags
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/books/${id}`
        );
        const data = await response.json();

        if (data.success) {
          setBook(data.data.book);
        } else {
          setError("Book not found");
        }
      } catch (err) {
        setError("Failed to load book details");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  // Check if user is admin
  useEffect(() => {
    const checkUserRole = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          setUser(user);
          setIsAdmin(user.role === "ADMIN");
        } catch (err) {
          console.error("Error parsing user data:", err);
        }
      }
    };

    checkUserRole();
  }, []);

  // Add to Cart Function
  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      setCartMessage("");

      // Check if user is authenticated
      const token = localStorage.getItem("token");
      if (!token) {
        setCartMessage("Please login to add items to cart");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
        return;
      }

      // Prepare the request
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cart/add`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookId: book._id,
            quantity: quantity,
          }),
        }
      );

      const data = await response.json();

      // Handle expired/invalid token — clear session and redirect to login
      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setCartMessage("❌ Session expired. Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
        return;
      }

      if (data.success) {
        setCartMessage("✅ Added to cart successfully!");

        // Clear message after 3 seconds
        setTimeout(() => {
          setCartMessage("");
        }, 3000);
      } else {
        setCartMessage(`❌ ${data.message || "Failed to add to cart"}`);

        // Clear error message after 3 seconds
        setTimeout(() => {
          setCartMessage("");
        }, 3000);
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      setCartMessage("❌ Network error. Please try again.");

      // Clear error message after 3 seconds
      setTimeout(() => {
        setCartMessage("");
      }, 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  // Handle Edit Book (Admin only)
  const handleEditBook = () => {
    navigate(`/admin/books/update-book/${book._id}`);
  };

  // Calculate discount percentage
  const calculateDiscount = () => {
    if (!book || !book.originalPrice) return 0;
    return Math.round(
      ((book.originalPrice - book.price) / book.originalPrice) * 100
    );
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Book Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The book you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      {/* SEO Meta Tags */}
      <Helmet key={id}>
        <title>{`${book.title} by ${book.author} | ${defaultSEO.siteName}`}</title>
        <meta name="description" content={book.about ? book.about.substring(0, 160) : `Buy ${book.title} by ${book.author} at ₹${book.price}. Available in ${book.format || 'Paperback'} format at CrazyDealsOnline with free delivery.`} />
        <meta name="keywords" content={`${book.title}, ${book.author}, ${book.category}, buy books online, ${book.tags?.join(', ') || ''}`} />
        <link rel="canonical" href={`${defaultSEO.siteUrl}/products/${slug}`} />

        {/* Open Graph */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={`${book.title} by ${book.author}`} />
        <meta property="og:description" content={book.about || `Get ${book.title} at the best price.`} />
        <meta property="og:image" content={book.images?.[0]?.url || defaultSEO.defaultImage} />
        <meta property="og:url" content={`${defaultSEO.siteUrl}/products/${slug}`} />
        <meta property="og:site_name" content={defaultSEO.siteName} />
        <meta property="product:price:amount" content={book.price} />
        <meta property="product:price:currency" content="INR" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${book.title} by ${book.author}`} />
        <meta name="twitter:description" content={book.about?.substring(0, 120) || `Buy ${book.title} at CrazyDealsOnline`} />
        <meta name="twitter:image" content={book.images?.[0]?.url || defaultSEO.defaultImage} />

        {/* JSON-LD Structured Data for Product */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": book.title,
            "author": {
              "@type": "Person",
              "name": book.author
            },
            "description": book.about,
            "image": book.images?.map(img => img.url) || [],
            "offers": {
              "@type": "Offer",
              "price": book.price,
              "priceCurrency": "INR",
              "availability": book.available && book.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
              "seller": {
                "@type": "Organization",
                "name": "CrazyDealsOnline"
              }
            },
            "isbn": book.details?.isbn,
            "numberOfPages": book.details?.pages,
            "publisher": {
              "@type": "Organization",
              "name": book.publisher
            },
            "inLanguage": book.language,
            "bookFormat": book.format === "Hardcover" ? "Hardcover" : "Paperback"
          })}
        </script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <button
            onClick={() => navigate("/")}
            className="hover:text-blue-600 transition-colors"
          >
            Home
          </button>
          <span>→</span>
          <button
            onClick={() =>
              navigate(`/collections/${book.category.toLowerCase()}`)
            }
            className="hover:text-blue-600 transition-colors capitalize"
          >
            {book.category}
          </button>
          <span>→</span>
          <span className="text-gray-900 font-medium truncate">
            {book.title}
          </span>
        </nav>

        {/* Admin Edit Button */}
        {isAdmin && (
          <div className="mb-4 flex justify-end">
            <button
              onClick={handleEditBook}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span>Edit Book</span>
            </button>
          </div>
        )}

        {/* Cart Message */}
        {cartMessage && (
          <div
            className={`mb-6 p-4 rounded-xl text-center font-semibold transition-all duration-300 ${cartMessage.includes("✅")
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
              }`}
          >
            {cartMessage}
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image Gallery - FIXED SECTION */}
            <div className="space-y-4">
              {/* Main Image Container - Fixed to prevent zooming */}
              <div className="bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-8 min-h-96">
                <img
                  src={book.images[selectedImage]?.url}
                  alt={book.images[selectedImage]?.alt || book.title}
                  className="max-w-full max-h-80 object-contain drop-shadow-lg"
                  style={{
                    width: "auto",
                    height: "auto",
                    maxWidth: "100%",
                    maxHeight: "320px",
                  }}
                />
              </div>

              {/* Thumbnail Images */}
              {book.images.length > 1 && (
                <div className="flex space-x-4 overflow-x-auto pb-2">
                  {book.images.map((image, index) => (
                    <button
                      key={image._id}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 bg-gray-50 flex items-center justify-center p-2 ${selectedImage === index
                        ? "border-blue-500"
                        : "border-gray-200"
                        }`}
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-contain"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Book Details */}
            <div className="space-y-6">
              {/* Title and Author */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {book.title}
                </h1>
                <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

                {/* Ratings */}
                {/* <div className="flex items-center space-x-2 mb-4">
                  <div className="flex text-yellow-400">
                    {"★".repeat(Math.floor(book.ratings.average) || 0)}
                    {"☆".repeat(5 - Math.floor(book.ratings.average) || 5)}
                  </div>
                  <span className="text-gray-500">
                    ({book.ratings.count} review
                    {book.ratings.count !== 1 ? "s" : ""})
                  </span>
                </div> */}
              </div>

              {/* Price Section */}
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{book.price}
                </span>
                {book.originalPrice && book.originalPrice > book.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{book.originalPrice}
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">
                      {calculateDiscount()}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${book.available && book.stock > 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
                  }`}
              >
                {book.available && book.stock > 0
                  ? `✓ In Stock (${book.stock} available)`
                  : "✗ Out of Stock"}
              </div>

              {/* Key Details - FIXED GRID FOR MOBILE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 py-4 border-y border-gray-200">
                <div className="flex justify-between sm:block">
                  <span className="text-gray-600 text-sm sm:text-base">
                    Format:
                  </span>
                  <span className="ml-2 font-semibold text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
                    {book.format}
                  </span>
                </div>
                <div className="flex justify-between sm:block">
                  <span className="text-gray-600 text-sm sm:text-base">
                    Publisher:
                  </span>
                  <span className="ml-2 font-semibold text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
                    {book.publisher}
                  </span>
                </div>
                <div className="flex justify-between sm:block">
                  <span className="text-gray-600 text-sm sm:text-base">
                    Language:
                  </span>
                  <span className="ml-2 font-semibold text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
                    {book.language}
                  </span>
                </div>
                <div className="flex justify-between sm:block">
                  <span className="text-gray-600 text-sm sm:text-base">
                    Pages:
                  </span>
                  <span className="ml-2 font-semibold text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
                    {book.details?.pages}
                  </span>
                </div>
                <div className="flex justify-between sm:block">
                  <span className="text-gray-600 text-sm sm:text-base">
                    ISBN:
                  </span>
                  <span className="ml-2 font-semibold text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
                    {book.details?.isbn}
                  </span>
                </div>
                <div className="flex justify-between sm:block">
                  <span className="text-gray-600 text-sm sm:text-base">
                    Country:
                  </span>
                  <span className="ml-2 font-semibold text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
                    {book.details?.country}
                  </span>
                </div>
              </div>

              {/* Quantity and Actions */}
              {book.available && book.stock > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-700 font-semibold">
                      Quantity:
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-semibold">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity(Math.min(book.stock, quantity + 1))
                        }
                        disabled={quantity >= book.stock}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      Max: {book.stock}
                    </span>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={handleAddToCart}
                      disabled={addingToCart}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                    >
                      {addingToCart ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Adding...
                        </>
                      ) : (
                        `Add to Cart - ₹${(book.price * quantity).toFixed(2)}`
                      )}
                    </button>
                    <button className="w-12 h-12 border-2 border-gray-300 rounded-xl flex items-center justify-center hover:border-gray-400 transition-colors">
                      <span className="text-xl">❤️</span>
                    </button>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => navigate("/viewcart")}
                      className="flex-1 border-2 border-blue-500 text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300"
                    >
                      View Cart
                    </button>
                    <button
                      onClick={() => navigate("/collections/science")}
                      className="flex-1 border-2 border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Info */}
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-700 space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-1">
                    <span>🚚</span>
                    <span>Free delivery</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>🔄</span>
                    <span>7-day returns</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>🛡️</span>
                    <span>Secure payment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information Tabs */}
          <div className="border-t border-gray-200">
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* About Section */}
                <div className="lg:col-span-2">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    About This Book
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{book.about}</p>

                  {/* Tags */}
                  {book.tags && book.tags.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Tags:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {book.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Details */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Book Details
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Published:</span>
                        <span className="font-medium">
                          {formatDate(book.createdAt)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="font-medium">
                          {formatDate(book.updatedAt)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium capitalize">
                          {book.category}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Format:</span>
                        <span className="font-medium">{book.format}</span>
                      </div>
                      {book.featured && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className="font-medium text-blue-600">
                            Featured
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Share Section */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Share This Book
                    </h4>
                    <div className="flex space-x-4">
                      <button className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                        f
                      </button>
                      <button className="w-10 h-10 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                        t
                      </button>
                      <button className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                        in
                      </button>
                      <button className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                        wa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Books Call to Action */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Love this book? Explore more in {book.category}
          </h3>
          <button
            onClick={() =>
              navigate(`/collections/${book.category.toLowerCase()}`)
            }
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            Browse {book.category} Books
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleBookPage;
