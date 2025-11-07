import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BookCategory = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();



    const pathParts = window.location.pathname.split("/");
    const lastPart = pathParts[pathParts.length - 1];




    // Fetch books for Science category
    useEffect(() => {
        const fetchScienceBooks = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `${process.env.VITE_API_URL}/api/books/category/${lastPart}?page=${currentPage}&limit=12`
                );
                const data = await response.json();

                if (data.success) {
                    setBooks(data.data.books);
                    setTotalPages(data.data.pagination.totalPages);
                } else {
                    setError('Failed to load science books');
                }
            } catch (err) {
                setError('Failed to load science books');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchScienceBooks();
    }, [currentPage]);

    // Book Card Component
    const BookCard = ({ book }) => (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden group">
            <div className="relative overflow-hidden">
                <img
                    src={book.images.find(img => img.isPrimary)?.url || book.images[0]?.url}
                    alt={book.images.find(img => img.isPrimary)?.alt || book.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {book.format}
                </div>
                {book.stock > 0 && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        In Stock
                    </div>
                )}
            </div>

            <div className="p-4">
                <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-2 h-10">
                    {book.title}
                </h3>
                <p className="text-gray-600 text-xs mb-2">by {book.author}</p>

                <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-gradient bg-gradient-to-r from-blue-600 to-cyan-600">
                        ₹{book.price}
                    </span>

                </div>

                <div className="flex gap-2">
                    <button onClick={() => navigate(`/products/${book._id}`)} className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-2 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105">
                        View Book
                    </button>
                </div>
            </div>
        </div>
    );

    // Pagination Component
    const Pagination = () => (
        <div className="flex justify-center items-center space-x-4 mt-12">
            <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${currentPage === 1
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transform hover:scale-105'
                    }`}
            >
                Previous
            </button>

            <span className="text-gray-700 font-semibold">
                Page {currentPage} of {totalPages}
            </span>

            <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${currentPage === totalPages
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transform hover:scale-105'
                    }`}
            >
                Next
            </button>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading science books...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
                <div className="text-center text-red-600">
                    <p className="text-xl mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
            {/* Hero Banner */}
            <div className="relative bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 text-white py-20 px-4">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Science Books
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 opacity-90">
                        Explore the Wonders of the Universe with Our Scientific Collection
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={() => navigate('/')}
                            className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            Back to Home
                        </button>
                        <button className="border-2 border-white text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white hover:bg-opacity-20 transition-all duration-300">
                            Filter Books
                        </button>
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-4 left-10 animate-bounce">
                    <div className="bg-white bg-opacity-20 rounded-full p-3">
                        <span className="text-2xl">🔬</span>
                    </div>
                </div>
                <div className="absolute bottom-4 right-10 animate-bounce delay-75">
                    <div className="bg-white bg-opacity-20 rounded-full p-3">
                        <span className="text-2xl">🌌</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                        Discover Scientific Marvels
                    </h2>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                        From quantum physics to biology, astronomy to chemistry - explore the latest
                        scientific discoveries and theories that shape our understanding of the world.
                    </p>
                </div>

                {/* Books Count */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">
                                {books.length} Science Books Found
                            </h3>
                            <p className="text-gray-600">Page {currentPage} of {totalPages}</p>
                        </div>
                    </div>
                </div>

                {/* Books Grid */}
                {books.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                            {books.map((book) => (
                                <BookCard key={book._id} book={book} />
                            ))}
                        </div>
                        <Pagination />
                    </>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🔭</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No Books Found</h3>
                        <p className="text-gray-600 mb-6">We couldn't find any science books at the moment.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-full font-bold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                        >
                            Browse Other Categories
                        </button>
                    </div>
                )}



                {/* Call to Action */}
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl p-8 text-center text-white mt-16 shadow-2xl">
                    <h2 className="text-3xl font-bold mb-4">
                        Science Enthusiast?
                    </h2>
                    <p className="text-xl mb-6 opacity-90">
                        Join our science community and get early access to new releases and exclusive content!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                            Join Now
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default BookCategory;