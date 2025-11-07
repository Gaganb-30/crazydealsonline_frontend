import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Search, ShoppingBag, ChevronLeft, ChevronRight, Star, Clock, Eye } from 'lucide-react';

const HomePage = () => {
    const [booksByCategory, setBooksByCategory] = useState({});
    const [latestBooks, setLatestBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [booksLoading, setBooksLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    // Categories to display with their routes and images
    const categories = [
        {
            name: 'Fiction',
            route: '/collections/fiction',
            image: 'https://i.postimg.cc/HLvRsJ6m/Fiction.png',
            color: 'bg-purple-200'
        },
        {
            name: 'Science',
            route: '/collections/science',
            image: 'https://i.postimg.cc/85F3F109/groovy-back-to-school-clipart-science-book-illustration-in-trendy-retro-y2k-style-png.png',
            color: 'bg-blue-200'
        },
        {
            name: 'History',
            route: '/collections/history',
            image: 'https://i.postimg.cc/nzs5sHP6/history.png',
            color: 'bg-yellow-100'
        },
        {
            name: 'Mystery',
            route: '/collections/mystery',
            image: 'https://i.postimg.cc/PxLcLtR0/pngtree-ancient-vintage-mystery-book-with-ornate-details-png-image-14657244.png',
            color: 'bg-pink-200'
        },
        {
            name: 'Romance',
            route: '/collections/romance',
            image: 'https://i.postimg.cc/9M4S4Wk0/romance.png',
            color: 'bg-pink-100'
        }
    ];

    const audioBooks = [
        { id: 1, title: "The sky between you and me", author: "S. C. Lally", duration: "58 hrs 24 mins" },
        { id: 2, title: "Normal People", author: "Sally Rooney", duration: "4 hrs 13 mins" },
        { id: 3, title: "A way to success", author: "Alex Roberts", duration: "4 hrs 30 mins" },
        { id: 4, title: "The fact of a body", author: "Chris McClean", duration: "11 hrs 08 mins" },
        { id: 5, title: "Harry potter", author: "J.K. Rowling", duration: "54 hrs 08 mins" },
        { id: 6, title: "The Witch", author: "Susan Smith", duration: "14 hrs 28 mins" },
    ];

    const feedbacks = [
        {
            id: 1,
            text: "Bookish is a breath of fresh air in the digital reading space. The design is clean, organized, and makes browsing feel effortless. I especially love the seamless integration with various reading devices and the personalized recommendations.",
            author: "Aroma Kane",
            role: "Senior Consultant",
            rating: 5,
        },
        {
            id: 2,
            text: "I was instantly drawn to the elegance of Bookish. The interface is smooth, responsive, and intuitively designed. Whether searching through catalogs or checking the designer's selections, I don't need to figure out navigation.",
            author: "Fanny Osinski",
            role: "Brand Architect",
            rating: 5,
        },
    ];

    // Fetch latest books
    const fetchLatestBooks = async () => {
        try {
            setBooksLoading(true);
            const response = await fetch(
                `${process.env.VITE_API_URL}/api/books?page=1&limit=18&sort=createdAt&order=desc`
            );
            const data = await response.json();

            if (data.success) {
                setLatestBooks(data.data.books || []);
            } else {
                throw new Error(data.message || 'Failed to fetch latest books');
            }
        } catch (err) {
            console.error('Error fetching latest books:', err);
            setError('Failed to load latest books');
        } finally {
            setBooksLoading(false);
        }
    };

    // Fetch books for each category
    useEffect(() => {
        const fetchBooksByCategory = async () => {
            try {
                setLoading(true);
                const categoryBooks = {};

                for (const category of categories) {
                    try {
                        const response = await fetch(
                            `${process.env.VITE_API_URL}/api/books/category/${category.name}?page=1&limit=8`
                        );
                        const data = await response.json();

                        if (data.success) {
                            categoryBooks[category.name] = data.data.books;
                        }
                    } catch (err) {
                        console.error(`Error fetching ${category.name} books:`, err);
                    }
                }

                setBooksByCategory(categoryBooks);
            } catch (err) {
                setError('Failed to load books');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooksByCategory();
        fetchLatestBooks();
    }, []);

    // Slider navigation
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % 3); // 3 slides for 18 books (6 per slide)
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + 3) % 3);
    };

    // Get current slide books
    const getCurrentSlideBooks = () => {
        const startIndex = currentSlide * 6;
        const endIndex = startIndex + 6;
        return latestBooks.slice(startIndex, endIndex);
    };

    // Slim Book Card Component for Latest Books
    const SlimBookCard = ({ book }) => (
        <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer flex flex-col h-full">
            <div className="relative">
                <img
                    src={book.images?.find(img => img.isPrimary)?.url || book.images?.[0]?.url || '/book-placeholder.jpg'}
                    alt={book.images?.find(img => img.isPrimary)?.alt || book.title}
                    className="w-full h-40 object-cover" // Slimmer image height
                />
                <div className="absolute top-2 right-2 bg-navy text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {book.format || 'Paperback'}
                </div>
            </div>

            <div className="p-3 flex-1 flex flex-col">
                <h3 className="font-bold text-navy mb-1 text-sm line-clamp-2 leading-tight">
                    {book.title}
                </h3>
                <p className="text-xs text-gray-600 mb-2 line-clamp-1">{book.author}</p>

                <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-navy">₹{book.price}</span>
                    {book.originalPrice && book.originalPrice > book.price && (
                        <span className="text-xs text-gray-500 line-through">₹{book.originalPrice}</span>
                    )}
                </div>

                <div className="mt-auto space-y-2">
                    <button
                        className="w-full border border-navy text-navy py-2 rounded text-sm font-medium hover:bg-navy hover:text-white transition-colors flex items-center justify-center gap-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/products/${book._id}`);
                        }}
                    >
                        <Eye size={14} />
                        View Book
                    </button>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="w-full bg-cream min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-navy mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading amazing books...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full bg-cream min-h-screen flex items-center justify-center">
                <div className="text-center text-red-600">
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-navy text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-cream overflow-x-hidden">
            {/* Hero Section */}
            <section className="flex items-center justify-between px-8 py-16 bg-cream">
                <div className="flex-1 pr-8">
                    <h1 className="text-5xl font-bold text-navy mb-4 leading-tight">Where every page begins a journey...</h1>
                    <p className="text-gray-600 mb-6 text-lg">A huge collection of ebook books based on new curiosity, by search answer, about your interest you want.</p>
                    <button
                        className="bg-navy text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 mb-8"
                        onClick={() => navigate('/collections/fiction')}
                    >
                        Get a book →
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-10 h-10 bg-yellow-300 rounded-full border-2 border-white"></div>
                            ))}
                        </div>
                        <div>
                            <div className="font-bold text-navy">10K+</div>
                            <div className="text-sm text-gray-600">Happy Customers</div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 relative">
                    <div className="bg-yellow-300 rounded-3xl p-12 relative z-10 min-h-96">
                        <div className="flex justify-center items-center h-full">
                            <div className="text-6xl">📖</div>
                        </div>
                    </div>

                    <div className="absolute bottom-0 right-0 bg-white rounded-2xl p-6 shadow-lg w-72 z-20">
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-navy mb-2">Norwegian Wood</h3>
                            <p className="text-sm text-gray-600 mb-4">Haruki Murakami - In a train to a futuristic present, Toru finds himself unraveling the mysterious workings of time and love.</p>
                            <p className="text-2xl font-bold text-navy mb-4">₹20.00</p>
                            <button className="w-full bg-navy text-white py-2 rounded-lg font-medium hover:bg-opacity-90">Add to bag</button>
                        </div>
                    </div>

                    <div className="absolute right-6 bottom-6 flex gap-3 z-30">
                        <button className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center hover:bg-opacity-90">
                            <ChevronLeft size={20} />
                        </button>
                        <button className="w-12 h-12 bg-navy text-white rounded-full flex items-center justify-center hover:bg-opacity-90">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-navy">Featured Categories</h2>
                    <button
                        className="text-navy font-medium hover:underline"
                        onClick={() => navigate('/categories')}
                    >
                        All Categories →
                    </button>
                </div>
                <div className="grid grid-cols-5 gap-4">
                    {categories.map(cat => (
                        <div
                            key={cat.name}
                            className={`${cat.color} rounded-2xl p-6 text-center cursor-pointer hover:shadow-lg transition flex flex-col items-center justify-center`}
                            onClick={() => navigate(cat.route)}
                        >
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-16 h-16 object-contain mb-2"
                            />
                            <p className="text-sm font-medium text-gray-800">{cat.name}</p>
                            <p className="text-gray-500 text-xs mt-1">
                                {booksByCategory[cat.name]?.length || 0} books
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Latest Books Slider */}
            <section className="px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-navy">Latest Books</h2>
                    <div className="flex gap-3">
                        <button
                            className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                            onClick={prevSlide}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                            onClick={nextSlide}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                {booksLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
                    </div>
                ) : latestBooks.length > 0 ? (
                    <div className="relative">
                        {/* Slide Container - Exact grid from your example */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {getCurrentSlideBooks().map((book) => (
                                <div
                                    key={book._id}
                                    className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer flex flex-col h-full"
                                    onClick={() => navigate(`/products/${book._id}`)}
                                >
                                    {/* Image Container - Exact styling from your example */}
                                    <div className="relative aspect-[3/4] bg-gray-100 flex items-center justify-center p-4">
                                        <img
                                            src={book.images?.find(img => img.isPrimary)?.url || book.images?.[0]?.url || '/book-placeholder.jpg'}
                                            alt={book.images?.find(img => img.isPrimary)?.alt || book.title}
                                            className="w-full h-full object-contain"
                                        />
                                        {/* Format Badge */}
                                        <div className="absolute top-2 right-2 bg-navy text-white px-2 py-1 rounded-full text-xs font-semibold">
                                            {book.format || 'Paperback'}
                                        </div>
                                    </div>

                                    {/* Content - Exact styling from your example */}
                                    <div className="p-4 flex-1 flex flex-col">
                                        <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">
                                            {book.title}
                                        </h3>
                                        <p className="text-gray-600 text-xs mb-3 line-clamp-1">{book.author}</p>

                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-lg font-bold text-gray-900">₹{book.price}</span>
                                            {book.originalPrice && book.originalPrice > book.price && (
                                                <span className="text-sm text-gray-500 line-through">₹{book.originalPrice}</span>
                                            )}
                                        </div>

                                        {/* Buttons - Styled to match your example */}
                                        <div className="mt-auto space-y-2">
                                            <button
                                                className="w-full border border-gray-300 text-gray-700 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/products/${book._id}`);
                                                }}
                                            >
                                                <Eye size={14} />
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Slide Indicators */}
                        <div className="flex justify-center mt-8 space-x-2">
                            {[0, 1, 2].map((index) => (
                                <button
                                    key={index}
                                    className={`w-3 h-3 rounded-full transition-colors ${currentSlide === index ? 'bg-navy' : 'bg-gray-300'
                                        }`}
                                    onClick={() => setCurrentSlide(index)}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        No latest books available
                    </div>
                )}
            </section>


            {/* Quote Section */}
            <section className="bg-black text-white px-8 py-12 my-12 rounded-2xl mx-8">
                <div className="max-w-4xl">
                    <p className="text-3xl font-bold italic text-center mb-4">
                        "I do believe something very magical can happen when you read a book."
                    </p>
                    <p className="text-center text-gray-400">— J.K. Rowling</p>
                </div>
            </section>

            {/* Promo Boxes */}
            <section className="px-8 py-12 grid grid-cols-3 gap-6">
                <div className="bg-teal-600 rounded-2xl p-8 text-white">
                    <h3 className="text-xl font-bold mb-2">New Publications</h3>
                    <p className="text-sm mb-4">Discover the latest releases</p>
                    <button onClick={() => navigate("/categories")} className="text-white underline text-sm font-medium">Show more →</button>
                </div>
                <div className="bg-blue-900 rounded-2xl p-8 text-white">
                    <h3 className="text-xl font-bold mb-2">Sale on History books</h3>
                    <p className="text-sm mb-4">Enjoy special discounts</p>
                    <button onClick={() => navigate("/collections/history")} className="text-white underline text-sm font-medium">Shop now →</button>
                </div>
                <div className="bg-red-400 rounded-2xl p-8 text-white">
                    <h3 className="text-xl font-bold mb-2">Top Rated</h3>
                    <p className="text-sm mb-4">Best sellers this week</p>
                    <button onClick={() => navigate("/categories")} className="text-white underline text-sm font-medium">Browse →</button>
                </div>
            </section>

            {/* Customer Feedback */}
            <section className="px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-navy">Customer Feedback</h2>
                    <div className="flex gap-3">
                        <button className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
                            <ChevronLeft size={18} />
                        </button>
                        <button className="w-10 h-10 bg-navy text-white rounded-full flex items-center justify-center hover:bg-opacity-90">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                    {feedbacks.map(feedback => (
                        <div key={feedback.id} className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
                            <div className="flex gap-1 mb-4">
                                {[...Array(feedback.rating)].map((_, i) => (
                                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-gray-700 mb-6">{feedback.text}</p>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                                <div>
                                    <p className="font-bold text-navy text-sm">{feedback.author}</p>
                                    <p className="text-xs text-gray-600">{feedback.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Newsletter */}
            <section className="bg-purple-400 text-white px-8 py-16 rounded-2xl mx-8 mb-12">
                <div className="max-w-2xl">
                    <h2 className="text-4xl font-bold mb-4">Subscribe to our Newsletter</h2>
                    <p className="mb-6 text-purple-100">Get the latest news and offers from Bookish. We publish updates regularly on our blog and you can unsubscribe at any time.</p>
                    <div className="flex gap-4">
                        <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-lg text-black" />
                        <button className="bg-navy text-white px-8 py-3 rounded-lg font-medium hover:bg-opacity-90">Subscribe</button>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default HomePage;