import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/books/categories`
        );
        const data = await response.json();

        if (data.success) {
          setCategories(data.data.categories);
        } else {
          setError("Failed to load categories");
        }
      } catch (err) {
        setError("Failed to load categories");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Category icons mapping
  const categoryIcons = {
    Science: "🔬",
    History: "📜",
    Fiction: "📖",
    Kids: "🧸",
    Biography: "👤",
    Technology: "💻",
    Business: "💼",
    Health: "💊",
    Travel: "✈️",
    Cooking: "👨‍🍳",
    Art: "🎨",
    Sports: "⚽",
    Religion: "🙏",
    Philosophy: "💭",
    Education: "🎓",
  };

  // Get icon for category
  const getCategoryIcon = (category) => {
    return categoryIcons[category] || "📚";
  };

  // Get gradient color based on category
  const getCategoryGradient = (category, index) => {
    const gradients = [
      "from-purple-500 via-purple-600 to-blue-600",
      "from-green-500 via-green-600 to-teal-600",
      "from-blue-500 via-blue-600 to-indigo-600",
      "from-red-500 via-red-600 to-pink-600",
      "from-yellow-500 via-yellow-600 to-orange-600",
      "from-indigo-500 via-indigo-600 to-purple-600",
      "from-pink-500 via-pink-600 to-rose-600",
      "from-teal-500 via-teal-600 to-cyan-600",
      "from-orange-500 via-orange-600 to-red-600",
      "from-cyan-500 via-cyan-600 to-blue-600",
      "from-rose-500 via-rose-600 to-pink-600",
      "from-lime-500 via-lime-600 to-green-600",
      "from-violet-500 via-violet-600 to-purple-600",
      "from-amber-500 via-amber-600 to-yellow-600",
      "from-emerald-500 via-emerald-600 to-green-600",
    ];
    return gradients[index % gradients.length];
  };

  // Get category description
  const getCategoryDescription = (category) => {
    const descriptions = {
      Science:
        "Discover the wonders of the universe and scientific breakthroughs",
      History:
        "Journey through time and explore the events that shaped our world",
      Fiction: "Immerse yourself in imaginative worlds and captivating stories",
      Kids: "Fun and educational books for young minds and curious children",
      Biography:
        "Inspiring stories of remarkable people and their life journeys",
      Technology: "Cutting-edge innovations and digital world advancements",
      Business: "Strategies, entrepreneurship and corporate success stories",
      Health: "Wellness, medicine and healthy living guides",
      Travel: "Explore the world through captivating travel experiences",
      Cooking: "Culinary arts, recipes and gastronomic adventures",
      Art: "Creative expressions, design and artistic masterpieces",
      Sports: "Athletic achievements, training and sports legends",
      Religion: "Spiritual wisdom and religious teachings",
      Philosophy: "Deep thoughts and philosophical perspectives",
      Education: "Learning resources and educational materials",
    };
    return (
      descriptions[category] || `Explore our collection of ${category} books`
    );
  };

  // Category Card Component
  const CategoryCard = ({ category, index }) => (
    <div
      className="relative group cursor-pointer transform transition-all duration-500 hover:scale-105"
      onClick={() => navigate(`/collections/${category.toLowerCase()}`)}
    >
      {/* Main Card */}
      <div
        className={`bg-gradient-to-br ${getCategoryGradient(
          category,
          index
        )} rounded-3xl p-8 h-64 flex flex-col justify-between text-white shadow-2xl hover:shadow-3xl transition-all duration-500 group-hover:rotate-1 border-2 border-white border-opacity-20`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 text-6xl opacity-50">
            {getCategoryIcon(category)}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white border-opacity-30">
            <span className="text-2xl">{getCategoryIcon(category)}</span>
          </div>

          {/* Category Name */}
          <h3 className="text-2xl font-bold mb-2 group-hover:text-white transition-colors duration-300">
            {category}
          </h3>

          {/* Description */}
          <p className="text-white text-opacity-80 text-sm leading-relaxed group-hover:text-opacity-100 transition-all duration-300">
            {getCategoryDescription(category)}
          </p>
        </div>

        {/* Explore Button */}
        <div className="relative z-10 flex justify-between items-center mt-4">
          <span className="text-white text-opacity-90 text-sm font-semibold group-hover:text-opacity-100 transition-all duration-300">
            Explore Collection
          </span>
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center group-hover:bg-opacity-30 transition-all duration-300 backdrop-blur-sm">
            <svg
              className="w-4 h-4 text-white transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white via-10% to-transparent opacity-0 group-hover:opacity-10 group-hover:translate-x-full transition-all duration-1000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 delay-200"></div>
      <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 delay-300"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Discovering Categories
          </h2>
          <p className="text-gray-500">Loading amazing book collections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white py-20 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 text-6xl">📚</div>
          <div className="absolute top-20 right-20 text-5xl">🔍</div>
          <div className="absolute bottom-20 left-20 text-4xl">⭐</div>
          <div className="absolute bottom-10 right-10 text-6xl">🎯</div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Book Categories
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Explore our vast collection of books across different genres. Each
            category holds unique stories waiting to be discovered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate("/")}
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Back to Home
            </button>
            <button
              onClick={() => navigate("/search")}
              className="border-2 border-white text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white hover:bg-opacity-20 transition-all duration-300"
            >
              Search Books
            </button>
          </div>
        </div>

        {/* Animated floating shapes */}
        <div className="absolute top-4 left-10 animate-bounce">
          <div className="w-4 h-4 bg-white rounded-full opacity-30"></div>
        </div>
        <div className="absolute bottom-10 right-20 animate-pulse">
          <div className="w-6 h-6 bg-white rounded-full opacity-20"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Stats */}
        <div className="text-center mb-12">
          <div className="inline-block bg-white rounded-2xl shadow-lg px-8 py-4 mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              {categories.length} Categories
            </h2>
            <p className="text-gray-600">
              Explore our diverse book collections
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <CategoryCard key={category} category={category} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">📖</div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              No Categories Found
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              We're working on adding more categories to our collection.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Browse All Books
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-12 text-center text-white mt-16 shadow-2xl relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 text-4xl">🌟</div>
            <div className="absolute bottom-4 right-4 text-4xl">📚</div>
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Use our advanced search to find specific books or contact us for
              special requests.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/search")}
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Advanced Search
              </button>
              <button
                onClick={() => navigate("/contact-us")}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:bg-opacity-20 transition-all duration-300"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Book Categories</h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Your gateway to endless stories and knowledge across all genres and
            interests.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-400">
            <span>© 2024 Crazy Deals Online</span>
            <span className="hidden sm:block">•</span>
            <span>Privacy Policy</span>
            <span className="hidden sm:block">•</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Category;
