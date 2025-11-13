import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const navigate = useNavigate();

  // Fetch user profile and cart data
  useEffect(() => {
    const fetchUserAndCart = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login to view your cart");
          setLoading(false);
          return;
        }

        // Fetch user profile first
        const userResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (userResponse.status === 401) {
          setError("Please login to view your cart");
          setLoading(false);
          return;
        }

        if (!userResponse.ok) {
          throw new Error(
            `Failed to fetch user profile: ${userResponse.status}`
          );
        }

        const userData = await userResponse.json();
        if (userData.success) {
          setUser(userData.data.user);
        }

        // Fetch cart data
        const cartResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/cart`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!cartResponse.ok) {
          throw new Error(`Failed to fetch cart: ${cartResponse.status}`);
        }

        const cartData = await cartResponse.json();

        if (cartData.success) {
          setCart(cartData.data);
        } else {
          setError(cartData.message || "Failed to load cart");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndCart();
  }, []);

  // Check if address is complete
  const isAddressComplete = (userAddress) => {
    if (!userAddress) return false;
    return (
      userAddress.street &&
      userAddress.city &&
      userAddress.state &&
      userAddress.zipCode
    );
  };

  // Calculate free delivery progress
  const calculateFreeDeliveryProgress = () => {
    const freeDeliveryThreshold = 1500;
    const currentTotal = cart?.totalPrice || 0;

    if (currentTotal >= freeDeliveryThreshold) {
      return {
        isFreeDelivery: true,
        progress: 100,
        message: "🎉 You've unlocked FREE delivery!",
        amountNeeded: 0,
        amountSaved: cart?.deliveryCharge || 0,
      };
    } else {
      const amountNeeded = freeDeliveryThreshold - currentTotal;
      const progress = (currentTotal / freeDeliveryThreshold) * 100;

      return {
        isFreeDelivery: false,
        progress: Math.min(progress, 100),
        message: `Add ₹${amountNeeded} more for FREE delivery`,
        amountNeeded,
      };
    }
  };

  // Calculate discount percentage for a book
  const calculateBookDiscount = (book) => {
    if (!book.originalPrice || book.originalPrice <= book.price) return null;

    const discountAmount = book.originalPrice - book.price;
    const discountPercentage = Math.round(
      (discountAmount / book.originalPrice) * 100
    );

    return {
      discountAmount,
      discountPercentage,
      originalPrice: book.originalPrice,
      currentPrice: book.price,
    };
  };

  // Calculate total savings from book discounts
  const calculateTotalBookSavings = () => {
    const cartItems = cart?.cart?.items || cart?.items || [];
    return cartItems.reduce((total, item) => {
      const bookDiscount = calculateBookDiscount(item.book);
      if (bookDiscount) {
        return total + bookDiscount.discountAmount * item.quantity;
      }
      return total;
    }, 0);
  };

  // Handle proceed to checkout
  const handleProceedToCheckout = () => {
    if (!user || !isAddressComplete(user.address)) {
      // Redirect to address completion page
      navigate("/additional-details", {
        state: {
          redirectTo: "/checkout",
          message:
            "Please complete your address information to proceed with checkout",
        },
      });
    } else {
      navigate("/checkout");
    }
  };

  // Update quantity
  const updateQuantity = async (bookId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setUpdatingItems((prev) => new Set(prev).add(bookId));
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cart/items/${bookId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      if (!response.ok) throw new Error("Failed to update quantity");

      const data = await response.json();
      if (data.success) {
        setCart(data.data);
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      alert("Failed to update quantity: " + err.message);
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(bookId);
        return newSet;
      });
    }
  };

  // Remove item from cart
  const removeItem = async (bookId) => {
    try {
      setUpdatingItems((prev) => new Set(prev).add(bookId));
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cart/items/${bookId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to remove item");

      const data = await response.json();
      if (data.success) {
        setCart(data.data);
      }
    } catch (err) {
      console.error("Error removing item:", err);
      alert("Failed to remove item: " + err.message);
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(bookId);
        return newSet;
      });
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cart/clear`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to clear cart");

      const data = await response.json();
      if (data.success) {
        setCart(data.data);
      }
    } catch (err) {
      console.error("Error clearing cart:", err);
      alert("Failed to clear cart: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Unable to Load Cart
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {error.includes("login") ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/sign-up")}
                  className="border-2 border-blue-500 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Check if cart is empty - based on your API structure
  const cartItems = cart?.cart?.items || cart?.items || [];
  const totalPrice = cart?.totalPrice || cart?.cart?.totalPrice || 0;
  const deliveryCharge =
    cart?.deliveryCharge || cart?.cart?.deliveryCharge || 0;
  const discountedPrice =
    cart?.discountedPrice || cart?.cart?.discountedPrice || totalPrice;
  const finalTotal =
    cart?.finalTotal || cart?.cart?.finalTotal || totalPrice + deliveryCharge;
  const totalItems = cart?.totalItems || cart?.cart?.totalItems || 0;
  const savings = cart?.savings || cart?.cart?.savings || 0;

  // Calculate additional metrics
  const freeDeliveryInfo = calculateFreeDeliveryProgress();
  const totalBookSavings = calculateTotalBookSavings();
  const totalSavings = totalBookSavings + savings;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Shopping Cart
            </h1>
            <p className="text-gray-600 text-lg">
              Your cart is waiting to be filled with amazing books!
            </p>
          </div>

          {/* Empty Cart */}
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-8xl mb-6">📚</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Your Cart is Empty
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Discover our amazing collection of books and start adding your
              favorites to the cart!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate("/collections/science")}
                className="border-2 border-blue-500 text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300"
              >
                Browse Books
              </button>
            </div>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shopping Cart
          </h1>
          <p className="text-gray-600 text-lg">
            Review your items and proceed to checkout
          </p>

          {/* Free Delivery Progress Bar */}
          <div className="mt-6 max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">
                  {freeDeliveryInfo.message}
                </span>
                <span className="text-sm font-bold text-gray-900">
                  ₹{totalPrice.toFixed(2)} / ₹1500
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${freeDeliveryInfo.progress}%` }}
                ></div>
              </div>
              {freeDeliveryInfo.isFreeDelivery && (
                <div className="mt-2 text-center">
                  <span className="text-green-600 font-semibold text-sm">
                    🎉 You're paying ₹{deliveryCharge} on delivery!
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Address Warning */}
          {user && !isAddressComplete(user.address) && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-yellow-600 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-yellow-800 font-medium">
                  Please complete your address information to proceed with
                  checkout
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {/* Cart Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  Cart Items ({cartItems.length})
                </h2>
                <div className="flex items-center space-x-4">
                  {totalSavings > 0 && (
                    <div className="text-green-600 font-semibold text-sm">
                      Total Savings: ₹{totalSavings.toFixed(2)}
                    </div>
                  )}
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
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
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="space-y-4">
              {cartItems.map((item) => {
                const bookDiscount = calculateBookDiscount(item.book);

                return (
                  <div
                    key={item.book?._id || item._id}
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Book Image */}
                      <div
                        className="flex-shrink-0 w-24 h-32 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => navigate(`/products/${item.book?._id}`)}
                      >
                        <img
                          src={
                            item.book?.images?.find((img) => img.isPrimary)
                              ?.url ||
                            item.book?.images?.[0]?.url ||
                            "/placeholder-book.jpg"
                          }
                          alt={item.book?.title || "Book image"}
                          className="w-full h-full object-cover"
                        />
                        {/* Discount Badge on Image */}
                        {bookDiscount && (
                          <div className="absolute -top-2 -left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            {bookDiscount.discountPercentage}% OFF
                          </div>
                        )}
                      </div>

                      {/* Book Details */}
                      <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                          <div className="flex-grow">
                            <h3
                              className="font-bold text-gray-900 text-lg mb-1 cursor-pointer hover:text-blue-600 transition-colors"
                              onClick={() =>
                                navigate(`/products/${item.book?._id}`)
                              }
                            >
                              {item.book?.title || "Unknown Book"}
                            </h3>
                            <p className="text-gray-600 text-sm mb-2">
                              by {item.book?.author || "Unknown Author"}
                            </p>
                            <div className="flex items-center space-x-2 mb-3">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                                {item.book?.format || "Unknown Format"}
                              </span>
                            </div>

                            {/* Discount Information */}
                            {bookDiscount && (
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-sm text-gray-500 line-through">
                                  ₹{bookDiscount.originalPrice.toFixed(2)}
                                </span>
                                <span className="text-green-600 font-semibold">
                                  Save ₹
                                  {(
                                    bookDiscount.discountAmount * item.quantity
                                  ).toFixed(2)}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            {bookDiscount ? (
                              <>
                                <p className="text-2xl font-bold text-gray-900 mb-1">
                                  ₹
                                  {(
                                    (item.book?.price || item.price || 0) *
                                    item.quantity
                                  ).toFixed(2)}
                                </p>
                                <p className="text-gray-600 text-sm">
                                  ₹
                                  {(
                                    item.book?.price ||
                                    item.price ||
                                    0
                                  ).toFixed(2)}{" "}
                                  × {item.quantity}
                                </p>
                                <p className="text-green-600 text-sm font-semibold mt-1">
                                  You save ₹
                                  {(
                                    bookDiscount.discountAmount * item.quantity
                                  ).toFixed(2)}
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="text-2xl font-bold text-gray-900 mb-1">
                                  ₹
                                  {(
                                    (item.book?.price || item.price || 0) *
                                    item.quantity
                                  ).toFixed(2)}
                                </p>
                                <p className="text-gray-600 text-sm">
                                  ₹
                                  {(
                                    item.book?.price ||
                                    item.price ||
                                    0
                                  ).toFixed(2)}{" "}
                                  × {item.quantity}
                                </p>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center space-x-3">
                            <span className="text-gray-700 font-semibold">
                              Quantity:
                            </span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.book?._id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={
                                  updatingItems.has(item.book?._id) ||
                                  item.quantity <= 1
                                }
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                -
                              </button>
                              <span className="w-12 text-center font-semibold">
                                {updatingItems.has(item.book?._id) ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
                                ) : (
                                  item.quantity
                                )}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.book?._id,
                                    item.quantity + 1
                                  )
                                }
                                disabled={updatingItems.has(item.book?._id)}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item.book?._id)}
                            disabled={updatingItems.has(item.book?._id)}
                            className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {updatingItems.has(item.book?._id) ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                            ) : (
                              <svg
                                className="w-4 h-4 mr-1"
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
                            )}
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              {/* Pricing Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>

                {/* Book Discounts */}
                {totalBookSavings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Book Discounts</span>
                    <span>-₹{totalBookSavings.toFixed(2)}</span>
                  </div>
                )}

                {/* Coupon Discount */}
                {savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span>
                    <span>-₹{savings.toFixed(2)}</span>
                  </div>
                )}

                {/* Total Savings */}
                {totalSavings > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold border-t border-gray-200 pt-2">
                    <span>Total Savings</span>
                    <span>-₹{totalSavings.toFixed(2)}</span>
                  </div>
                )}

                {/* Delivery Charge */}
                <div className="flex justify-between text-gray-600">
                  <span>
                    Delivery
                    {freeDeliveryInfo.isFreeDelivery && (
                      <span className="text-green-600 ml-1">(FREE)</span>
                    )}
                  </span>
                  <span
                    className={
                      freeDeliveryInfo.isFreeDelivery ? "text-green-600" : ""
                    }
                  >
                    {freeDeliveryInfo.isFreeDelivery
                      ? "FREE"
                      : `₹${deliveryCharge.toFixed(2)}`}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Savings Highlight */}
              {totalSavings > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-center">
                    <span className="text-green-700 font-semibold text-sm">
                      🎉 You're saving ₹{totalSavings.toFixed(2)} on this order!
                    </span>
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg mb-4"
              >
                Proceed to Checkout
              </button>

              {/* Continue Shopping */}
              <button
                onClick={() => navigate("/")}
                className="w-full border-2 border-blue-500 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300"
              >
                Continue Shopping
              </button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                  <div className="text-center">
                    <div className="text-lg">🚚</div>
                    <div>Free Shipping Over ₹1500</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg">🔒</div>
                    <div>Secure Payment</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg">↩️</div>
                    <div>Easy Returns</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
