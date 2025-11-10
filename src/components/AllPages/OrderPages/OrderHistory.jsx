import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    hasNext: false,
    hasPrev: false,
  });

  const navigate = useNavigate();

  // Status colors for badges
  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    PROCESSING: "bg-indigo-100 text-indigo-800",
    SHIPPED: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    REFUNDED: "bg-gray-100 text-gray-800",
  };

  // Status icons
  const statusIcons = {
    PENDING: "⏳",
    CONFIRMED: "✅",
    PROCESSING: "🔧",
    SHIPPED: "🚚",
    DELIVERED: "📦",
    CANCELLED: "❌",
    REFUNDED: "💸",
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view your orders");
        setLoading(false);
        return;
      }

      // Build query string - MATCHING BACKEND ROUTE
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append("status", filters.status);
      queryParams.append("page", filters.page);
      queryParams.append("limit", filters.limit);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        setError("Please login to view your orders");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setOrders(data.data.orders || []);
        setPagination(
          data.data.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalOrders: 0,
            hasNext: false,
            hasPrev: false,
          }
        );
      } else {
        throw new Error(data.message || "Failed to load orders");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUser(data.data.user);
          }
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  // Fetch orders when filters change
  useEffect(() => {
    fetchOrders();
  }, [filters.status, filters.page]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Check if order can be cancelled
  const canCancelOrder = (order) => {
    return (
      order.status === "PENDING" ||
      order.status === "CONFIRMED" ||
      order.status === "PROCESSING"
    );
  };

  // Handle order cancellation - MATCHING BACKEND ROUTE
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/cancel/${orderId}`,
        {
          method: "PATCH", // Changed to PATCH to match backend
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason: "Cancelled by user",
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Refresh orders
        fetchOrders();
        alert("Order cancelled successfully");
      } else {
        alert(data.message || "Failed to cancel order");
      }
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert("Failed to cancel order");
    }
  };

  // ... rest of the component remains the same until the return statement
  // [Keep all the JSX and rendering logic exactly the same as previous version]
  // Only the API endpoints have been updated above

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error && error.includes("login")) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">Please login to view your orders</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() =>
                navigate("/login", { state: { redirectTo: "/orders" } })
              }
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/")}
              className="border-2 border-blue-500 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Orders</h1>
          <p className="text-gray-600 text-lg">Track and manage your orders</p>
        </div>

        {/* Error Message */}
        {error && !error.includes("login") && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
            <button
              onClick={fetchOrders}
              className="ml-4 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Filters and Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-semibold">Filter by:</span>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Orders</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className="text-sm text-gray-600">
              Showing {orders.length} of {pagination.totalOrders} orders
            </div>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-8xl mb-6">📦</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              No Orders Found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {filters.status
                ? `You don't have any ${filters.status.toLowerCase()} orders.`
                : "You haven't placed any orders yet."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Start Shopping
              </button>
              {filters.status && (
                <button
                  onClick={() => handleFilterChange("status", "")}
                  className="border-2 border-blue-500 text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300"
                >
                  View All Orders
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Order Header */}
                <div className="border-b border-gray-200 p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            statusColors[order.status]
                          }`}
                        >
                          {statusIcons[order.status]} {order.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                      {order.deliveredAt && (
                        <p className="text-green-600 text-sm">
                          Delivered on {formatDate(order.deliveredAt)}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 mb-1">
                        {formatPrice(order.finalAmount)}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div
                        key={item._id || index}
                        className="flex items-center space-x-4 py-2"
                      >
                        <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={
                              item.book?.images?.find((img) => img.isPrimary)
                                ?.url ||
                              item.book?.images?.[0]?.url ||
                              "/placeholder-book.jpg"
                            }
                            alt={item.book?.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-semibold text-gray-900">
                            {item.book?.title || item.title}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            by {item.book?.author || item.author}
                          </p>
                          <p className="text-gray-600 text-sm">
                            Qty: {item.quantity} × {formatPrice(item.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}

                    {order.items.length > 3 && (
                      <div className="text-center pt-2 border-t border-gray-200">
                        <p className="text-gray-600 text-sm">
                          + {order.items.length - 3} more item
                          {order.items.length - 3 !== 1 ? "s" : ""}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Order Actions */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      <Link
                        to={`/orders/${order._id}`}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </Link>

                      {order.deliveryTracking?.trackingLink && (
                        <a
                          href={order.deliveryTracking.trackingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                          Track Order
                        </a>
                      )}
                    </div>

                    <div className="flex items-center space-x-4">
                      {canCancelOrder(order) && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="text-red-600 hover:text-red-700 font-semibold text-sm"
                        >
                          Cancel Order
                        </button>
                      )}

                      {order.status === "DELIVERED" && (
                        <button
                          onClick={() =>
                            navigate(`/products/${order.items[0]?.book?._id}`)
                          }
                          className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                        >
                          Buy Again
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>

            <div className="flex items-center space-x-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === pagination.totalPages ||
                    Math.abs(page - pagination.currentPage) <= 1
                )
                .map((page, index, array) => {
                  // Add ellipsis for gaps
                  const showEllipsis = index > 0 && page - array[index - 1] > 1;
                  return (
                    <div key={page} className="flex items-center">
                      {showEllipsis && <span className="px-2">...</span>}
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg font-semibold ${
                          page === pagination.currentPage
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        } transition-colors`}
                      >
                        {page}
                      </button>
                    </div>
                  );
                })}
            </div>

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 flex justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="border-2 border-blue-500 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
