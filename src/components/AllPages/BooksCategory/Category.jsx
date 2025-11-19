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

  // Category icons with better emoji selection
  const categoryIcons = {
    Science: "🧪",
    History: "📜",
    Fiction: "📚",
    Kids: "🐻",
    Biography: "👤",
    Technology: "💻",
    Business: "📊",
    Health: "❤️",
    Travel: "✈️",
    Cooking: "🍳",
    Art: "🎨",
    Sports: "⚽",
    Religion: "🕊️",
    Philosophy: "🤔",
    Education: "🎓",
  };

  // More refined gradient combinations
  const getCategoryGradient = (category, index) => {
    const gradients = [
      "from-purple-400 to-blue-500",
      "from-emerald-400 to-cyan-500",
      "from-blue-400 to-indigo-500",
      "from-rose-400 to-pink-500",
      "from-amber-400 to-orange-500",
      "from-indigo-400 to-purple-500",
      "from-pink-400 to-rose-500",
      "from-cyan-400 to-blue-500",
      "from-orange-400 to-red-500",
      "from-teal-400 to-green-500",
      "from-violet-400 to-purple-500",
      "from-lime-400 to-green-500",
      "from-sky-400 to-blue-500",
      "from-fuchsia-400 to-purple-500",
      "from-amber-400 to-yellow-500",
    ];
    return gradients[index % gradients.length];
  };

  // Better category descriptions
  const getCategoryDescription = (category) => {
    const descriptions = {
      Science: "Explore scientific discoveries and the wonders of our universe",
      History: "Journey through time and uncover the stories that shaped us",
      Fiction: "Lose yourself in imaginative worlds and compelling narratives",
      Kids: "Spark young imaginations with fun and educational stories",
      Biography: "Discover inspiring lives and remarkable personal journeys",
      Technology: "Stay ahead with insights into innovation and digital trends",
      Business: "Master strategies for success in the corporate world",
      Health: "Embrace wellness with guides to healthy living and medicine",
      Travel: "Wander through captivating destinations and cultures",
      Cooking:
        "Create culinary masterpieces with expert recipes and techniques",
      Art: "Immerse yourself in creative expression and visual masterpieces",
      Sports: "Dive into athletic excellence and competitive spirit",
      Religion: "Explore spiritual wisdom and religious traditions",
      Philosophy: "Ponder life's big questions and profound ideas",
      Education: "Expand your knowledge with learning resources and materials",
    };
    return descriptions[category] || `Discover our ${category} collection`;
  };

  // Loading component
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-pulse flex space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-150"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-300"></div>
          </div>
          <p className="text-slate-600 font-medium">Loading categories...</p>
        </div>
      </div>
    );
  }

  // Error component
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md space-y-6">
          <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">📚</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-900">
              Something went wrong
            </h3>
            <p className="text-slate-600">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="font-medium">Back to Home</span>
            </button>
            <h1 className="text-xl font-semibold text-slate-900">
              Book Categories
            </h1>
            <div className="w-20"></div> {/* Spacer for balance */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Explore by Category
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Find your next favorite book in our carefully curated collections
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-slate-400">
            <span>{categories.length} categories</span>
            <span>•</span>
            <span>Thousands of books</span>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={category}
              onClick={() => navigate(`/collections/${category.toLowerCase()}`)}
              className="group cursor-pointer"
            >
              <div
                className={`bg-gradient-to-br ${getCategoryGradient(
                  category,
                  index
                )} rounded-2xl p-6 text-white shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-105`}
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-xl">
                    {categoryIcons[category] || "📖"}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-semibold text-lg mb-2 capitalize">
                  {category}
                </h3>
                <p className="text-white text-opacity-90 text-sm leading-relaxed mb-4">
                  {getCategoryDescription(category)}
                </p>

                {/* CTA */}
                <div className="flex items-center justify-between">
                  <span className="text-white text-opacity-80 text-sm font-medium">
                    Browse books
                  </span>
                  <svg
                    className="w-4 h-4 text-white text-opacity-80 transform group-hover:translate-x-1 transition-transform"
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
            </div>
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              No categories available
            </h3>
            <p className="text-slate-600 max-w-md mx-auto">
              We're currently organizing our book collections. Please check back
              soon.
            </p>
          </div>
        )}

        {/* Search CTA */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Looking for something specific?
            </h3>
            <p className="text-slate-600 mb-6">
              Use our search to find exactly what you're looking for
            </p>
            <button
              onClick={() => navigate("/search")}
              className="bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors inline-flex items-center space-x-2"
            >
              <span>Search Books</span>
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-8 text-sm text-slate-600">
              <span>© 2024 BookStore</span>
              <span>•</span>
              <button className="hover:text-slate-900 transition-colors">
                Privacy
              </button>
              <span>•</span>
              <button className="hover:text-slate-900 transition-colors">
                Terms
              </button>
            </div>
            <p className="text-slate-500 text-sm">
              Discover your next great read with us
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Category;
