import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch cart and user data
  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login", {
            state: {
              redirectTo: "/checkout",
              message: "Please login to proceed with checkout",
            },
          });
          return;
        }

        // Fetch user profile
        const userResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
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
          throw new Error("Failed to fetch cart");
        }

        const cartData = await cartResponse.json();
        if (cartData.success) {
          setCart(cartData.data);
        } else {
          throw new Error(cartData.message || "Failed to load cart");
        }
      } catch (err) {
        console.error("Error fetching checkout data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutData();
  }, [navigate]);

  // Process Razorpay Payment
  const processRazorpayPayment = async () => {
    try {
      setProcessing(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("user"));

      // Step 1: Create payment order on backend
      const orderResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/create-payment`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentMethod: "RAZORPAY",
            useSavedAddress: true,
            // If you want to use a different address, you can pass shippingAddress here
            // shippingAddress: { ... }
          }),
        }
      );

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.message || "Failed to create payment order");
      }

      console.log("Order created:", orderData);

      // Step 2: Configure Razorpay options
      const options = {
        key: orderData.data.razorpayKeyId,
        amount: Math.round(orderData.data.amount * 100), // Convert to paise
        currency: orderData.data.currency,
        order_id: orderData.data.razorpayOrderId,
        name: "Crazy Deals Online",
        description: `Order #${orderData.data.order.orderNumber}`,
        image: "/logo.png", // Your website logo
        handler: async function (response) {
          // Step 3: Verify payment with backend
          try {
            const verifyResponse = await fetch(
              `${import.meta.env.VITE_API_URL}/api/orders/verify-payment`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              setSuccess("Payment successful! Your order has been confirmed.");
              // Redirect to order success page after 2 seconds
              setTimeout(() => {
                navigate(`/order-success/${orderData.data.order.id}`);
              }, 2000);
            } else {
              setError(verifyData.message || "Payment verification failed");
            }
          } catch (verifyError) {
            console.error("Verification error:", verifyError);
            setError("Failed to verify payment. Please contact support.");
          }
        },
        prefill: {
          name: userData?.name || "",
          email: userData?.email || "",
          contact: userData?.phone || "",
        },
        notes: {
          orderId: orderData.data.order.id,
          orderNumber: orderData.data.order.orderNumber,
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function () {
            console.log("Payment modal closed by user");
            setError("Payment was cancelled. You can try again.");
          },
        },
      };

      // Step 4: Open Razorpay checkout
      const razorpay = new window.Razorpay(options);

      // Handle payment failure
      razorpay.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        setError(`Payment failed: ${response.error.description}`);
      });

      razorpay.open();
    } catch (err) {
      console.error("Payment processing error:", err);
      setError(err.message || "Failed to process payment");
    } finally {
      setProcessing(false);
    }
  };

  // Handle Cash on Delivery
  const handleCashOnDelivery = async () => {
    try {
      setProcessing(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      const orderResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/create-payment`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentMethod: "CASH_ON_DELIVERY",
            useSavedAddress: true,
          }),
        }
      );

      const orderData = await orderResponse.json();

      if (orderData.success) {
        setSuccess(
          "Order placed successfully! Pay when your order is delivered."
        );
        setTimeout(() => {
          navigate(`/order-success/${orderData.data.order.id}`);
        }, 2000);
      } else {
        throw new Error(orderData.message || "Failed to place order");
      }
    } catch (err) {
      console.error("COD order error:", err);
      setError(err.message || "Failed to place order");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
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
          <p className="text-gray-600 mb-6">
            Please login to proceed with checkout
          </p>
          <button
            onClick={() =>
              navigate("/login", { state: { redirectTo: "/checkout" } })
            }
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (!cart || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Checkout Failed
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "Unable to load checkout data"}
          </p>
          <button
            onClick={() => navigate("/cart")}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  // Extract cart data
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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 mb-6">
            Add some items to your cart before checking out
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Checkout</h1>
          <p className="text-gray-600 text-lg">Complete your purchase</p>
        </div>

        {/* Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details & Shipping */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Shipping Address
              </h2>
              {user.address ? (
                <div className="space-y-2">
                  <p className="text-gray-800">
                    <strong>{user.name}</strong>
                  </p>
                  <p className="text-gray-600">
                    {user.address.hNo}, {user.address.street}
                  </p>
                  <p className="text-gray-600">
                    {user.address.city}, {user.address.state} -{" "}
                    {user.address.zipCode}
                  </p>
                  <p className="text-gray-600">{user.address.country}</p>
                  {user.phone && (
                    <p className="text-gray-600">Phone: {user.phone}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">No address saved</p>
              )}
              <button
                onClick={() =>
                  navigate("/additional-details", {
                    state: { redirectTo: "/checkout" },
                  })
                }
                className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
              >
                Change Address
              </button>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Items ({cartItems.length})
              </h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.book?._id}
                    className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-0"
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
                      <h3 className="font-semibold text-gray-900">
                        {item.book?.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        by {item.book?.author}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ₹
                        {(
                          (item.book?.price || item.price) * item.quantity
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary & Payment */}
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
                {savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{savings.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">
                    {deliveryCharge === 0
                      ? "FREE"
                      : `₹${deliveryCharge.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total Amount</span>
                    <span>₹{finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Select Payment Method
                </h3>

                {/* Razorpay Payment */}
                <button
                  onClick={processRazorpayPayment}
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
                      Processing...
                    </>
                  ) : (
                    `Pay ₹${finalTotal.toFixed(2)}`
                  )}
                </button>

                {/* Cash on Delivery */}
                <button
                  onClick={handleCashOnDelivery}
                  disabled={processing}
                  className="w-full border-2 border-green-500 text-green-600 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? "Placing Order..." : "Cash on Delivery"}
                </button>
              </div>

              {/* Security Badges */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="text-center">
                    <div className="text-lg">🔒</div>
                    <div>Secure Payment</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg">🛡️</div>
                    <div>SSL Encrypted</div>
                  </div>
                </div>
              </div>

              {/* Back to Cart */}
              <button
                onClick={() => navigate("/viewcart")}
                className="w-full mt-4 text-gray-600 hover:text-gray-700 font-semibold text-sm"
              >
                ← Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
