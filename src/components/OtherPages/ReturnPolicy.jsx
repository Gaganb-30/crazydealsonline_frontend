import { Link } from "react-router-dom";

const ReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500 mb-4">
            Return Policy
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Policy Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8 mb-8">
          <div className="prose prose-invert max-w-none">
            <div className="space-y-8">
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  1. Overview
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  At CrazyDealsOnline, we strive to provide the best shopping
                  experience for our customers. Due to the digital nature of our
                  products and to maintain the integrity of our content, we have
                  specific policies regarding returns and cancellations.
                </p>
              </section>

              {/* No Returns Policy */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  2. No Returns After Delivery
                </h2>
                <div className="bg-amber-900/20 border border-amber-700 rounded-lg p-6 mb-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-amber-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-amber-400 mb-2">
                        Important Notice
                      </h3>
                      <p className="text-amber-100">
                        Once your order has been delivered or your digital
                        content has been accessed, we do not accept returns or
                        offer refunds under any circumstances.
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  This policy is in place because our products are primarily
                  digital content that cannot be physically returned. Once you
                  receive access to your purchased materials, the transaction is
                  considered complete.
                </p>
              </section>

              {/* Cancellation Policy */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  3. Order Cancellation
                </h2>
                <div className="space-y-6">
                  <div className="bg-green-900/20 border border-green-700 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-green-400 mb-3">
                      ✅ 48-Hour Cancellation Window
                    </h3>
                    <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                      <li>
                        You may cancel your order within{" "}
                        <strong>48 hours</strong> of placing it
                      </li>
                      <li>
                        Cancellation requests must be submitted before the order
                        is processed for delivery
                      </li>
                      <li>
                        Refunds for cancelled orders will be processed within
                        5-7 business days
                      </li>
                    </ul>
                  </div>

                  <div className="bg-red-900/20 border border-red-700 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-red-400 mb-3">
                      ❌ Cancellation Restrictions
                    </h3>
                    <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                      <li>
                        <strong>No cancellations</strong> after 48 hours from
                        order placement
                      </li>
                      <li>
                        <strong>No cancellations</strong> once the order has
                        been processed for delivery
                      </li>
                      <li>
                        <strong>No cancellations</strong> for orders that have
                        been partially or fully delivered
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* How to Cancel */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  4. How to Cancel Your Order
                </h2>
                <div className="bg-gray-700/50 rounded-lg p-6">
                  <ol className="list-decimal list-inside text-gray-300 space-y-3 ml-4">
                    <li className="pb-2">
                      <strong>Login to your account</strong> and go to "Order
                      History"
                    </li>
                    <li className="pb-2">
                      <strong>Find the order</strong> you wish to cancel (must
                      be within 48 hours)
                    </li>
                    <li className="pb-2">
                      <strong>Click "Cancel Order"</strong> and provide a reason
                      for cancellation
                    </li>
                    <li className="pb-2">
                      <strong>Wait for confirmation</strong> email regarding
                      your cancellation request
                    </li>
                    <li>
                      <strong>Refund will be processed</strong> to your original
                      payment method within 5-7 business days
                    </li>
                  </ol>
                </div>
              </section>

              {/* Refund Process */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  5. Refund Process
                </h2>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>
                    Refunds are only available for orders cancelled within the
                    48-hour window
                  </li>
                  <li>Refunds will be issued to the original payment method</li>
                  <li>
                    Processing time: 5-7 business days after cancellation
                    approval
                  </li>
                  <li>
                    You will receive email confirmation once refund is processed
                  </li>
                </ul>
              </section>

              {/* Exceptions */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  6. Exceptional Circumstances
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  While we maintain a strict no-return policy after delivery, we
                  understand that exceptional circumstances may occur. In rare
                  cases, we may consider the following:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Duplicate orders placed by mistake</li>
                  <li>
                    Technical issues preventing access to content (we'll provide
                    alternative solutions)
                  </li>
                  <li>Orders that were never delivered due to system errors</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  For any exceptional cases, please contact our support team
                  with detailed information.
                </p>
              </section>

              {/* Digital Products */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  7. Digital Products Policy
                </h2>
                <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">
                    Digital Content Specifics
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Since we primarily deal with digital books and content:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                    <li>
                      Once downloaded or accessed, returns are not possible
                    </li>
                    <li>Preview samples are available before purchase</li>
                    <li>Ensure your device compatibility before ordering</li>
                    <li>
                      Contact support for technical issues rather than returns
                    </li>
                  </ul>
                </div>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  8. Contact for Cancellations
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  For cancellation requests or questions about our return
                  policy:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mt-2">
                  <li>Email: support@crazydealsonline.in</li>
                  <li>Response Time: Within 24 hours</li>
                  <li>
                    Please include your order number in all communications
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Policy Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-900/20 p-4 rounded-lg border border-green-800">
              <h4 className="font-semibold text-green-400 mb-2">
                What You CAN Do
              </h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>✓ Cancel within 48 hours of ordering</li>
                <li>✓ Get full refund for timely cancellations</li>
                <li>✓ Contact support for technical issues</li>
              </ul>
            </div>
            <div className="bg-red-900/20 p-4 rounded-lg border border-red-800">
              <h4 className="font-semibold text-red-400 mb-2">
                What You CAN'T Do
              </h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>✗ Return after delivery</li>
                <li>✗ Cancel after 48 hours</li>
                <li>✗ Return accessed digital content</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <Link to="/" className="hover:text-cyan-400 transition-colors">
              Home
            </Link>
            <Link
              to="/privacy-policy"
              className="hover:text-cyan-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/contact-us"
              className="hover:text-cyan-400 transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/refund-policy"
              className="hover:text-cyan-400 transition-colors"
            >
              Refund Policy
            </Link>
            <Link
              to="/terms-and-conditions"
              className="hover:text-cyan-400 transition-colors"
            >
              Terms and Conditions
            </Link>
            <Link
              to="/disclaimer"
              className="hover:text-cyan-400 transition-colors"
            >
              Disclaimer
            </Link>
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} CrazyDealsOnline. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
