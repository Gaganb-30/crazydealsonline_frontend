// pages/OrderDetails.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { orderId } = useParams();
  const navigate = useNavigate();

  // Status colors and icons (same as OrderHistory)
  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    PROCESSING: "bg-indigo-100 text-indigo-800",
    SHIPPED: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    REFUNDED: "bg-gray-100 text-gray-800",
  };

  const statusIcons = {
    PENDING: "⏳",
    CONFIRMED: "✅",
    PROCESSING: "🔧",
    SHIPPED: "🚚",
    DELIVERED: "📦",
    CANCELLED: "❌",
    REFUNDED: "💸",
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login to view order details");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          setError("Please login to view order details");
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch order: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setOrder(data.data.order);
        } else {
          throw new Error(data.message || "Failed to load order");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/orders")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              Back to Orders
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

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The order you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/orders")}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Order Details
          </h1>
          <p className="text-gray-600 text-lg">Order #{order.orderNumber}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Order Status
                </h2>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    statusColors[order.status]
                  }`}
                >
                  {statusIcons[order.status]} {order.status}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>Order Placed:</strong> {formatDate(order.createdAt)}
                </p>
                {order.deliveredAt && (
                  <p>
                    <strong>Delivered:</strong> {formatDate(order.deliveredAt)}
                  </p>
                )}
                {order.cancelledAt && (
                  <p>
                    <strong>Cancelled:</strong> {formatDate(order.cancelledAt)}
                  </p>
                )}
              </div>

              {order.deliveryTracking?.trackingLink && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <a
                    href={order.deliveryTracking.trackingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    🚚 Track Your Package
                  </a>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Items ({order.items.length})
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {item.book?.title || item.title}
                      </h3>
                      <p className="text-gray-600">
                        by {item.book?.author || item.author}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Format: {item.book?.format || item.format}
                      </p>
                      <p className="text-gray-600">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-lg">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      {order.status === "DELIVERED" && (
                        <button
                          onClick={() =>
                            navigate(`/products/${item.book?._id}`)
                          }
                          className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-semibold"
                        >
                          Buy Again
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Shipping Address
              </h2>
              <div className="text-gray-600 space-y-1">
                <p className="font-semibold">
                  {order.shippingAddress?.hNo}, {order.shippingAddress?.street}
                </p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}
                </p>
                <p>
                  {order.shippingAddress?.zipCode},{" "}
                  {order.shippingAddress?.country}
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({order.totalItems} items)</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {order.deliveryCharge === 0
                      ? "FREE"
                      : formatPrice(order.deliveryCharge)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(order.finalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-900 mb-2">Payment</h3>
                <p className="text-gray-600 text-sm">
                  Method: {order.paymentMethod}
                </p>
                <p className="text-gray-600 text-sm">
                  Status: {order.paymentStatus}
                </p>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-3">
                <button
                  onClick={() => navigate("/orders")}
                  className="w-full border-2 border-blue-500 text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Back to Orders
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
