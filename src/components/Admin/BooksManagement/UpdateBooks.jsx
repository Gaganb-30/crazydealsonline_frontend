import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateBooks = () => {
  const [formData, setFormData] = useState({
    title: "",
    publisher: "",
    language: "English",
    price: "",
    originalPrice: "",
    about: "",
    format: "Paperback",
    category: "",
    author: "",
    tags: "",
    stock: "",
    featured: false,
    // Book details
    isbn: "",
    pages: "",
    weight: "",
    country: "India",
    publicationDate: "",
  });
  const [images, setImages] = useState([{ url: "", alt: "", isPrimary: true }]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Categories for dropdown
  const categories = [
    "Fiction",
    "Non-Fiction",
    "Science",
    "Technology",
    "Biography",
    "History",
    "Self-Help",
    "Business",
    "Children",
    "Young Adult",
    "Romance",
    "Mystery",
    "Thriller",
    "Fantasy",
    "Science Fiction",
    "Horror",
    "Poetry",
    "Drama",
    "Cookbooks",
    "Travel",
    "Religion",
    "Art",
    "Music",
    "Education",
    "Health",
    "Sports",
  ];

  const formats = ["Paperback", "Hardcover"];

  // Check if user is admin and fetch book data
  useEffect(() => {
    const checkAuthorizationAndFetchBook = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!token || !userData) {
          setCheckingAuth(false);
          return;
        }

        const user = JSON.parse(userData);
        setUser(user);

        // Verify user role with backend
        const userResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.success && userData.data.user.role === "ADMIN") {
            setAuthorized(true);

            // Fetch book data
            await fetchBookData(token);
          }
        }
      } catch (err) {
        console.error("Authorization check or book fetch failed:", err);
        setError("Failed to load book data");
      } finally {
        setCheckingAuth(false);
        setFetchLoading(false);
      }
    };

    const fetchBookData = async (token) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/books/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            const book = data.data.book;

            // Format the data for the form
            setFormData({
              title: book.title || "",
              publisher: book.publisher || "",
              language: book.language || "English",
              price: book.price || "",
              originalPrice: book.originalPrice || "",
              about: book.about || "",
              format: book.format || "Paperback",
              category: book.category || "",
              author: book.author || "",
              tags: book.tags ? book.tags.join(", ") : "",
              stock: book.stock || "",
              featured: book.featured || false,
              isbn: book.details?.isbn || "",
              pages: book.details?.pages || "",
              weight: book.details?.weight || "",
              country: book.details?.country || "India",
              publicationDate: book.details?.publicationDate
                ? new Date(book.details.publicationDate)
                    .toISOString()
                    .split("T")[0]
                : "",
            });

            // Set existing images or initialize with empty one
            if (book.images && book.images.length > 0) {
              setImages(book.images);
            } else {
              setImages([{ url: "", alt: "", isPrimary: true }]);
            }
          } else {
            setError("Book not found");
          }
        } else {
          setError("Failed to fetch book data");
        }
      } catch (err) {
        console.error("Error fetching book:", err);
        setError("Failed to load book data");
      }
    };

    checkAuthorizationAndFetchBook();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setError("");
    setSuccess("");
  };

  // Handle image URL and alt text changes
  const handleImageChange = (index, field, value) => {
    const updatedImages = [...images];
    updatedImages[index][field] = value;

    // If URL is filled and we're not at max images, add a new empty field
    if (
      field === "url" &&
      value.trim() !== "" &&
      index === updatedImages.length - 1 &&
      updatedImages.length < 10
    ) {
      updatedImages.push({ url: "", alt: "", isPrimary: false });
    }

    setImages(updatedImages);
  };

  // Remove an image field
  const removeImage = (index) => {
    if (images.length > 1) {
      const updatedImages = images.filter((_, i) => i !== index);
      // If we removed the primary image, set the first image as primary
      if (images[index].isPrimary && updatedImages.length > 0) {
        updatedImages[0].isPrimary = true;
      }
      setImages(updatedImages);
    }
  };

  // Set an image as primary
  const setPrimaryImage = (index) => {
    const updatedImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    setImages(updatedImages);
  };

  // Add a new empty image field
  const addImageField = () => {
    if (images.length < 10) {
      setImages([...images, { url: "", alt: "", isPrimary: false }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (
      !formData.title ||
      !formData.publisher ||
      !formData.price ||
      !formData.category ||
      !formData.author ||
      !formData.weight
    ) {
      setError(
        "Title, publisher, price, category, author and weight are required fields"
      );
      setLoading(false);
      navigate(`/products/${id}`);
      return;
    }

    if (parseFloat(formData.price) < 0) {
      setError("Price cannot be negative");
      setLoading(false);
      return;
    }

    if (formData.stock && parseInt(formData.stock) < 0) {
      setError("Stock cannot be negative");
      setLoading(false);
      return;
    }

    // Validate images - filter out empty URLs and ensure at least one primary image
    const validImages = images
      .filter((img) => img.url.trim() !== "")
      .map((img, index) => ({
        ...img,
        // If no image is marked as primary, set the first one as primary
        isPrimary: index === 0 ? true : img.isPrimary,
      }));

    if (validImages.length === 0) {
      setError("At least one image URL is required");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Prepare book data for update
      const bookData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice
          ? parseFloat(formData.originalPrice)
          : undefined,
        stock: formData.stock ? parseInt(formData.stock) : 0,
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : [],
        images: validImages,
        weight: parseFloat(formData.weight),
      };

      // Remove empty optional fields
      Object.keys(bookData).forEach((key) => {
        if (bookData[key] === "" || bookData[key] === undefined) {
          delete bookData[key];
        }
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/books/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookData),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess("Book updated successfully!");
        // Update local images state with the response data
        if (data.data.book.images) {
          setImages(data.data.book.images);
        }
      } else {
        setError(data.message || "Failed to update book");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Update book error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle book deletion
  const handleDeleteBook = async () => {
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/books/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess("Book deleted successfully!");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setError(data.message || "Failed to delete book");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Delete book error:", err);
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  // Show loading while checking authorization
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  // Show loading while fetching book data
  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading book data...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized message if user is not admin
  if (!authorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. This area is
            restricted to administrators only.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              Go to Home
            </button>
            {!user && (
              <button
                onClick={() => navigate("/login")}
                className="border-2 border-blue-500 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show error if book not found
  if (error && !formData.title) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Book Not Found
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/admin")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              Back to Admin
            </button>
            <button
              onClick={() => navigate("/")}
              className="border-2 border-blue-500 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Update Book</h1>
          <p className="text-gray-600 text-lg">
            Edit the book details for "{formData.title}"
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Delete Book Section - Separate from the form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-l-4 border-red-500">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h3 className="text-lg font-semibold text-red-700 mb-2">
                Danger Zone
              </h3>
              <p className="text-gray-600 text-sm">
                Once you delete this book, it cannot be recovered. This action
                is permanent.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span>Delete Book</span>
            </button>
          </div>
        </div>

        {/* Book Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Basic Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Basic Information
              </h3>

              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Book Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter book title"
                />
              </div>

              {/* Author */}
              <div>
                <label
                  htmlFor="author"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Author *
                </label>
                <input
                  id="author"
                  name="author"
                  type="text"
                  required
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter author name"
                />
              </div>

              {/* Publisher */}
              <div>
                <label
                  htmlFor="publisher"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Publisher *
                </label>
                <input
                  id="publisher"
                  name="publisher"
                  type="text"
                  required
                  value={formData.publisher}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter publisher name"
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Format */}
              <div>
                <label
                  htmlFor="format"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Format
                </label>
                <select
                  id="format"
                  name="format"
                  value={formData.format}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  {formats.map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </select>
              </div>

              {/* Language */}
              <div>
                <label
                  htmlFor="language"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Language
                </label>
                <input
                  id="language"
                  name="language"
                  type="text"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Language"
                />
              </div>
            </div>

            {/* Right Column - Pricing & Details */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Pricing & Details
              </h3>

              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Price (₹) *
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="0.00"
                />
              </div>

              {/* Original Price */}
              <div>
                <label
                  htmlFor="originalPrice"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Original Price (₹)
                </label>
                <input
                  id="originalPrice"
                  name="originalPrice"
                  type="number"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="0.00"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Leave empty if no discount
                </p>
              </div>

              {/* Stock */}
              <div>
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Stock Quantity
                </label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="0"
                />
              </div>

              {/* Stock */}
              <div>
                <label
                  htmlFor="weight"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Weight (gm) *
                </label>
                <input
                  id="weight"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  required
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="0"
                />
              </div>

              {/* ISBN */}
              <div>
                <label
                  htmlFor="isbn"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  ISBN
                </label>
                <input
                  id="isbn"
                  name="isbn"
                  type="text"
                  value={formData.isbn}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter ISBN"
                />
              </div>

              {/* Pages */}
              <div>
                <label
                  htmlFor="pages"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Number of Pages
                </label>
                <input
                  id="pages"
                  name="pages"
                  type="number"
                  value={formData.pages}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Number of pages"
                />
              </div>

              {/* Publication Date */}
              <div>
                <label
                  htmlFor="publicationDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Publication Date
                </label>
                <input
                  id="publicationDate"
                  name="publicationDate"
                  type="date"
                  value={formData.publicationDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Full Width Fields */}
          <div className="mt-8 space-y-6 border-t pt-8">
            {/* About/Description */}
            <div>
              <label
                htmlFor="about"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Book Description
              </label>
              <textarea
                id="about"
                name="about"
                rows={4}
                value={formData.about}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter book description..."
              />
            </div>

            {/* Tags */}
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tags
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter tags separated by commas (e.g., fiction, bestseller, award-winning)"
              />
            </div>

            {/* Images Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Book Images (
                {images.filter((img) => img.url.trim() !== "").length} added,
                max 10)
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Enter image URLs. A new field will automatically appear when you
                fill one. The first image will be used as primary by default.
              </p>

              {/* Image URL Inputs */}
              <div className="space-y-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      {/* Image URL */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Image URL {index + 1} *
                        </label>
                        <input
                          type="url"
                          value={image.url}
                          onChange={(e) =>
                            handleImageChange(index, "url", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>

                      {/* Alt Text */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Alt Text
                        </label>
                        <input
                          type="text"
                          value={image.alt}
                          onChange={(e) =>
                            handleImageChange(index, "alt", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          placeholder="Book cover image"
                        />
                      </div>
                    </div>

                    {/* Image Actions */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(index)}
                          disabled={image.isPrimary}
                          className={`text-xs px-3 py-1 rounded-full ${
                            image.isPrimary
                              ? "bg-green-500 text-white cursor-default"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          } transition-colors`}
                        >
                          {image.isPrimary
                            ? "✓ Primary Image"
                            : "Set as Primary"}
                        </button>
                        {image.url && (
                          <div className="text-xs text-gray-500">
                            {image.isPrimary && "★ Primary"}
                          </div>
                        )}
                      </div>

                      {/* Remove Button */}
                      {images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    {/* Image Preview */}
                    {image.url && (
                      <div className="mt-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Preview:
                        </label>
                        <div className="w-24 h-32 border border-gray-300 rounded-lg overflow-hidden">
                          <img
                            src={image.url}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00IDE2TDEwIDEwTDE0IDE0TDIwIDhWMjBINFYxNloiIGZpbGw9IiNEOEQ5REEiLz4KPGNpcmNsZSBjeD0iOC41IiBjeT0iNy41IiByPSIyLjUiIGZpbGw9IiNBOUE5QTkiLz4KPC9zdmc+";
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add More Images Button */}
              {images.length < 10 && (
                <button
                  type="button"
                  onClick={addImageField}
                  className="mt-4 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center space-x-2"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>Add Another Image</span>
                </button>
              )}

              {/* Max Images Message */}
              {images.length >= 10 && (
                <p className="mt-2 text-sm text-gray-500 text-center">
                  Maximum 10 images reached
                </p>
              )}
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center">
              <input
                id="featured"
                name="featured"
                type="checkbox"
                checked={formData.featured}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="featured"
                className="ml-2 block text-sm text-gray-700"
              >
                Feature this book on the homepage
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                  Updating...
                </>
              ) : (
                "Update Book"
              )}
            </button>
          </div>
        </form>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Delete Book
                </h3>
                <p className="text-gray-600">
                  Are you sure you want to delete{" "}
                  <strong>"{formData.title}"</strong>? This action cannot be
                  undone and all book data will be permanently removed.
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteBook}
                  disabled={deleteLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {deleteLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    "Delete Book"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateBooks;
